"use client";

import { useState, useEffect, useRef } from "react";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { Card3D } from "@/components/Card3D";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Square, Volume2, VolumeX, CheckCircle2, Flame, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { syncTokenToExtension } from "@/utils/extensionSync";
import { useAuth } from "@clerk/nextjs";

// Ambient sounds
// Ambient sounds - using reliable short loops for demo
// Ambient sounds - using Web Audio API for reliable noise generation
const SOUNDS = [
  { id: "rain", name: "Pink Noise (Rain)", url: "" },
  { id: "forest", name: "Brown Noise (Deep)", url: "" },
  { id: "cafe", name: "White Noise (Focus)", url: "" },
];

export default function ZenPage() {
  const api = useApi();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [initialDuration, setInitialDuration] = useState(25 * 60);
  const [goal, setGoal] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  // Web Audio API Context
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      stopNoise();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    checkActiveSession();
    fetchStats();
    
    // Poll for session status every 2 seconds to sync across tabs
    const interval = setInterval(() => {
      checkActiveSession();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const checkActiveSession = async () => {
    try {
      const res = await api.get("/focus/active");
      if (res.data.active) {
        if (!isActive) {
          setIsActive(true);
          toast.success("Resumed active session from another tab");
        }
        // Sync timer if needed
        if (res.data.session && res.data.session.startTime) {
             const startTime = new Date(res.data.session.startTime).getTime();
             const elapsed = Math.floor((Date.now() - startTime) / 1000);
             const newTimeLeft = Math.max(0, initialDuration - elapsed);
             // Only update if significantly different (e.g. > 2s drift) to avoid jitter
             if (Math.abs(newTimeLeft - timeLeft) > 2) {
               setTimeLeft(newTimeLeft);
             }
        }
      } else {
        // If server says not active, but we are active, stop.
        if (isActive) {
            setIsActive(false);
            setTimeLeft(initialDuration);
            toast.info("Session ended in another tab.");
            fetchStats();
        }
      }
    } catch (error) {
      // Silent fail for polling
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/focus/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const toggleTimer = async () => {
    if (!isActive) {
      // Start
      try {
        await api.post("/focus/start", { goals: goal ? [goal] : [] });
        setIsActive(true);
        toast.success("Zen Mode Activated. Distractions blocked.");
      } catch (error) {
        toast.error("Failed to start session");
      }
    } else {
      // Pause (local only for MVP)
      setIsActive(false);
    }
  };

  const stopSession = async () => {
    try {
      await api.post("/focus/end");
      setIsActive(false);
      setTimeLeft(initialDuration);
      toast.info("Session ended.");
      fetchStats();
    } catch (error) {
      toast.error("Failed to end session");
    }
  };

  const handleComplete = async () => {
    await stopSession();
    toast.success("Focus session completed! Great job! 🎉");
  };

  const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'pink' | 'brown') => {
    const bufferSize = 2 * ctx.sampleRate; // 2 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // (roughly) compensate for gain
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // (roughly) compensate for gain
      }
    }
    return buffer;
  };

  const playNoise = (type: 'white' | 'pink' | 'brown') => {
    stopNoise();
    
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      
      const ctx = audioContextRef.current;
      const buffer = createNoiseBuffer(ctx, type);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      source.start();
      
      sourceNodeRef.current = source;
      gainNodeRef.current = gainNode;
    } catch (error) {
      console.error("Web Audio API error:", error);
      toast.error("Could not play sound. Browser might not support Web Audio.");
      setActiveSound(null);
    }
  };

  const stopNoise = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      setActiveSound(null);
      stopNoise();
    } else {
      setActiveSound(soundId);
      // Map IDs to noise types
      const typeMap: Record<string, 'white' | 'pink' | 'brown'> = {
        'rain': 'pink',   // Pink noise sounds like rain
        'forest': 'brown', // Brown noise is deeper, like distant thunder/waterfall
        'cafe': 'white'    // White noise is static, good for masking
      };
      
      // Update UI names to reflect what they actually are now, or keep thematic names but explain
      playNoise(typeMap[soundId] || 'white');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const { getToken } = useAuth();
  const handleManualSync = async () => {
    try {
      const token = await getToken();
      if (token) {
        await syncTokenToExtension(token);
        toast.success("Extension sync signal sent!");
      } else {
        toast.error("Could not get authentication token.");
      }
    } catch (e) {
      toast.error("Sync failed.");
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Zen Mode</h1>
          <p className="text-muted-foreground">
            Eliminate distractions and focus on what matters.
          </p>
          <Button variant="outline" size="sm" onClick={handleManualSync} className="mt-2 text-xs">
            <RefreshCw className="w-3 h-3 mr-2" />
            Sync Extension
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Timer Card */}
          <Card3D className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-10 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {!isActive && !goal ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-md space-y-4 z-10"
                >
                  <label className="text-indigo-100 font-medium ml-1">What are you working on?</label>
                  <Input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Finish project report..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg h-12"
                  />
                  <div className="flex gap-2 justify-center mt-4">
                    {[15, 25, 45, 60].map((mins) => (
                      <Button
                        key={mins}
                        variant={initialDuration === mins * 60 ? "secondary" : "ghost"}
                        onClick={() => {
                          setInitialDuration(mins * 60);
                          setTimeLeft(mins * 60);
                        }}
                        className={initialDuration === mins * 60 ? "bg-white text-indigo-600 hover:bg-white/90" : "text-white hover:bg-white/20"}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center z-10"
                >
                  <h3 className="text-xl text-indigo-100 mb-8 font-medium">{goal || "Focus Session"}</h3>
                  <div className="text-9xl font-bold font-mono tracking-tighter mb-8 tabular-nums">
                    {formatTime(timeLeft)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 z-10 mt-8">
              {!isActive ? (
                <Button
                  size="lg"
                  className="h-16 w-16 rounded-full bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                  onClick={toggleTimer}
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 w-16 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setIsActive(false)}
                  >
                    <Pause className="w-8 h-8" />
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="h-16 w-16 rounded-full bg-red-500/80 hover:bg-red-500 text-white border-none"
                    onClick={stopSession}
                  >
                    <Square className="w-6 h-6 fill-current" />
                  </Button>
                </>
              )}
            </div>
          </Card3D>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Stats */}
            <Card3D className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Today's Focus</span>
                  <span className="font-bold text-xl">{stats ? formatDuration(stats.totalDuration) : "0m"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="font-bold">{stats?.totalSessions || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="font-bold text-orange-500">{stats?.currentStreak || 0} days</span>
                </div>
              </div>
            </Card3D>

            {/* Ambient Sounds */}
            <Card3D className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-500" />
                Focus Noise
              </h3>
              <div className="space-y-3">
                {SOUNDS.map((sound) => (
                  <div
                    key={sound.id}
                    onClick={() => toggleSound(sound.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      activeSound === sound.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-transparent"
                    }`}
                  >
                    <span className={activeSound === sound.id ? "text-blue-600 dark:text-blue-400 font-medium" : ""}>
                      {sound.name}
                    </span>
                    {activeSound === sound.id && (
                      <div className="flex gap-1">
                        <span className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {activeSound && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(val) => setVolume(val[0] / 100)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </Card3D>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
