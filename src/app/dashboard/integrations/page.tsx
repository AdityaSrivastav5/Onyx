"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckSquare, Users, RefreshCw, Check, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useApi } from "@/hooks/useApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isConnected: boolean;
  lastSync?: string;
  syncStatus?: 'idle' | 'syncing' | 'error';
  accountEmail?: string;
}

function IntegrationsContent() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync your events bi-directionally',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      isConnected: false,
      syncStatus: 'idle'
    },
    {
      id: 'google-tasks',
      name: 'Google Tasks',
      description: 'Import your tasks',
      icon: <CheckSquare className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      isConnected: false,
      syncStatus: 'idle'
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Sync calendar and tasks',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      isConnected: false,
      syncStatus: 'idle'
    }
  ]);

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const api = useApi();
  const searchParams = useSearchParams();

  const fetchStatus = async () => {
    try {
      const response = await api.get('/integrations/status');
      const statusMap = response.data;
      
      setIntegrations(prev => prev.map(int => {
        const status = statusMap[int.id];
        if (status) {
          return {
            ...int,
            isConnected: status.isConnected,
            lastSync: status.lastSync,
            syncStatus: status.syncStatus,
            accountEmail: status.accountEmail
          };
        }
        return int;
      }));
    } catch (error) {
      console.error('Failed to fetch integration status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    const status = searchParams.get('status');
    const connected = searchParams.get('connected');
    
    if (status === 'success' || connected) {
      toast.success('Integration connected successfully!');
      fetchStatus();
    } else if (status === 'error') {
      toast.error('Failed to connect integration.');
    }
  }, [searchParams]);

  const handleConnect = async (integrationId: string) => {
    setIsLoading(integrationId);
    
    try {
      const response = await api.post(`/integrations/${integrationId}/connect`);
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Failed to initiate connection');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    setIsLoading(integrationId);
    
    try {
      await api.post(`/integrations/${integrationId}/disconnect`);
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, isConnected: false, accountEmail: undefined, lastSync: undefined }
            : int
        )
      );
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect integration');
    } finally {
      setIsLoading(null);
    }
  };

  const handleSync = async (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { ...int, syncStatus: 'syncing' }
          : int
      )
    );

    try {
      await api.post(`/integrations/${integrationId}/sync`);
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, syncStatus: 'idle', lastSync: new Date().toISOString() }
            : int
        )
      );
      toast.success('Sync started successfully');
    } catch (error) {
      console.error('Failed to sync:', error);
      toast.error('Failed to start sync');
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, syncStatus: 'error' }
            : int
        )
      );
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect external services to sync your data</p>
        </motion.div>

        {/* Integration Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-white mb-4`}>
                      {integration.icon}
                    </div>
                    {integration.isConnected && (
                      <Badge variant="secondary" className="gap-1">
                        <Check className="w-3 h-3" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {integration.isConnected && (
                    <div className="space-y-2 text-sm">
                      {integration.accountEmail && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Account:</span>
                          <span className="font-medium">{integration.accountEmail}</span>
                        </div>
                      )}
                      
                      {integration.lastSync && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Last sync:</span>
                          <span className="font-medium">
                            {new Date(integration.lastSync).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <div className="flex items-center gap-2">
                          {integration.syncStatus === 'syncing' && (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span className="text-blue-600 dark:text-blue-400">Syncing...</span>
                            </>
                          )}
                          {integration.syncStatus === 'idle' && (
                            <>
                              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                              <span className="text-green-600 dark:text-green-400">Up to date</span>
                            </>
                          )}
                          {integration.syncStatus === 'error' && (
                            <>
                              <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                              <span className="text-red-600 dark:text-red-400">Error</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {integration.isConnected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleSync(integration.id)}
                          disabled={integration.syncStatus === 'syncing' || isLoading === integration.id}
                        >
                          {integration.syncStatus === 'syncing' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sync Now
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                          disabled={isLoading === integration.id}
                        >
                          {isLoading === integration.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Disconnect'
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleConnect(integration.id)}
                        disabled={isLoading === integration.id}
                      >
                        {isLoading === integration.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          'Connect'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">How Integrations Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Google Calendar:</strong> Two-way sync - changes in Onyx or Google Calendar will sync automatically</p>
              <p>• <strong>Google Tasks:</strong> One-way import - your Google Tasks will be imported into Onyx</p>
              <p>• <strong>Microsoft Teams:</strong> Import calendar events and tasks from your Teams account</p>
              <p className="pt-2 text-xs">All connections use secure OAuth 2.0 authentication. Your credentials are never stored.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <IntegrationsContent />
    </Suspense>
  );
}
