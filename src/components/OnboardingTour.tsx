"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "welcome",
    title: "Welcome to Onyx! 🎉",
    content: "Your all-in-one productivity platform. Let's take a quick tour to get you started.",
    position: "bottom"
  },
  {
    target: "[href='/dashboard/tasks']",
    title: "Manage Your Tasks",
    content: "Create, organize, and track tasks with our powerful Kanban board and list views.",
    position: "right"
  },
  {
    target: "[href='/dashboard/habits']",
    title: "Build Better Habits",
    content: "Track daily habits, build streaks, and visualize your progress with our habit tracker.",
    position: "right"
  },
  {
    target: "[href='/dashboard/zen']",
    title: "Focus Mode",
    content: "Use the Pomodoro timer and ambient sounds to enter deep focus sessions.",
    position: "right"
  },
  {
    target: "[href='/dashboard/calendar']",
    title: "Stay Organized",
    content: "Manage events and sync with Google Calendar to keep everything in one place.",
    position: "right"
  },
  {
    target: "[href='/dashboard/expenses']",
    title: "Track Finances",
    content: "Monitor expenses, view analytics, and manage your budget effectively.",
    position: "right"
  }
];

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Check if user has completed the tour
    const tourCompleted = localStorage.getItem("onboarding_tour_completed");
    if (!tourCompleted) {
      // Delay tour start to let page load
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStep];
    if (step.target === "welcome") {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(step.target) as HTMLElement;
    setTargetElement(element);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem("onboarding_tour_completed", "true");
    setIsActive(false);
  };

  const skipTour = () => {
    localStorage.setItem("onboarding_tour_completed", "true");
    setIsActive(false);
  };

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isWelcome = step.target === "welcome";

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={skipTour}
          />
        )}
      </AnimatePresence>

      {/* Spotlight */}
      {targetElement && (
        <div
          className="fixed z-[101] pointer-events-none"
          style={{
            top: targetElement.offsetTop - 8,
            left: targetElement.offsetLeft - 8,
            width: targetElement.offsetWidth + 16,
            height: targetElement.offsetHeight + 16,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            borderRadius: "8px",
          }}
        />
      )}

      {/* Tour Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed z-[102] ${
            isWelcome
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : getCardPosition(targetElement, step.position)
          }`}
        >
          <Card className="w-[400px] p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.content}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 -mt-2 -mr-2"
                onClick={skipTour}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-1 mb-4">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button size="sm" onClick={handleNext}>
                  {currentStep === TOUR_STEPS.length - 1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {currentStep === 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={skipTour}
              >
                Skip tour
              </Button>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function getCardPosition(
  element: HTMLElement | null,
  position: string = "bottom"
): string {
  if (!element) return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

  const rect = element.getBoundingClientRect();
  const offset = 16;

  switch (position) {
    case "top":
      return `top-[${rect.top - offset}px] left-[${rect.left}px] -translate-y-full`;
    case "bottom":
      return `top-[${rect.bottom + offset}px] left-[${rect.left}px]`;
    case "left":
      return `top-[${rect.top}px] left-[${rect.left - offset}px] -translate-x-full`;
    case "right":
      return `top-[${rect.top}px] left-[${rect.right + offset}px]`;
    default:
      return `top-[${rect.bottom + offset}px] left-[${rect.left}px]`;
  }
}
