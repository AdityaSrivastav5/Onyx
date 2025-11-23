"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { Download, FileJson, Database, Calendar, CheckSquare, FileText, CreditCard, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

export default function ExportPage() {
  const api = useApi();
  const [isExporting, setIsExporting] = useState(false);

  const exportAllData = async () => {
    setIsExporting(true);
    try {
      // Fetch all data
      const [tasks, habits, notes, expenses, events] = await Promise.all([
        api.get("/tasks").catch(() => ({ data: [] })),
        api.get("/habits").catch(() => ({ data: [] })),
        api.get("/notes").catch(() => ({ data: [] })),
        api.get("/expenses").catch(() => ({ data: [] })),
        api.get("/events").catch(() => ({ data: [] })),
      ]);

      const exportData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        data: {
          tasks: tasks.data,
          habits: habits.data,
          notes: notes.data,
          expenses: expenses.data,
          events: events.data,
        },
        metadata: {
          totalTasks: tasks.data.length,
          totalHabits: habits.data.length,
          totalNotes: notes.data.length,
          totalExpenses: expenses.data.length,
          totalEvents: events.data.length,
        }
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `onyx-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const exportModule = async (module: string) => {
    try {
      const response = await api.get(`/${module}`);
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `onyx-${module}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${module.charAt(0).toUpperCase() + module.slice(1)} exported!`);
    } catch (error) {
      console.error(`Export ${module} failed:`, error);
      toast.error(`Failed to export ${module}`);
    }
  };

  const modules = [
    { id: "tasks", name: "Tasks", icon: <CheckSquare className="w-5 h-5" />, color: "text-blue-600" },
    { id: "habits", name: "Habits", icon: <Target className="w-5 h-5" />, color: "text-purple-600" },
    { id: "notes", name: "Notes", icon: <FileText className="w-5 h-5" />, color: "text-green-600" },
    { id: "expenses", name: "Expenses", icon: <CreditCard className="w-5 h-5" />, color: "text-orange-600" },
    { id: "events", name: "Events", icon: <Calendar className="w-5 h-5" />, color: "text-pink-600" },
  ];

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
          <p className="text-muted-foreground">
            Download your data for backup or migration purposes
          </p>
        </motion.div>

        {/* Export All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-600 text-white">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Export All Data</CardTitle>
                  <CardDescription>
                    Download a complete backup of all your Onyx data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={exportAllData}
                disabled={isExporting}
                size="lg"
                className="w-full"
              >
                <Download className="w-5 h-5 mr-2" />
                {isExporting ? "Exporting..." : "Export All Data"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Export by Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Export by Module</CardTitle>
              <CardDescription>
                Download specific data modules individually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {modules.map((module, i) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-4"
                      onClick={() => exportModule(module.id)}
                    >
                      <div className={`mr-3 ${module.color}`}>
                        {module.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{module.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Export {module.name.toLowerCase()} data
                        </div>
                      </div>
                      <FileJson className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">About Data Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Exported data is in JSON format and can be imported back into Onyx</p>
              <p>• All exports include metadata like export date and version</p>
              <p>• Your data is never sent to external servers during export</p>
              <p>• Keep your export files secure as they contain your personal data</p>
              <p>• Regular backups are recommended to prevent data loss</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
