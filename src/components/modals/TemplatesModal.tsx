"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TASK_TEMPLATES } from "@/lib/templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sun, BarChart3, Rocket, PenTool, CalendarCheck, Bug } from "lucide-react";
import { toast } from "sonner";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (tasks: any[]) => void;
}

// Icon mapping
const ICON_MAP: Record<string, any> = {
  Sun,
  BarChart3,
  Rocket,
  PenTool,
  CalendarCheck,
  Bug,
};

export function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  const handleSelectTemplate = (template: typeof TASK_TEMPLATES[0]) => {
    onSelectTemplate(template.tasks);
    toast.success(`${template.name} template applied!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Templates</DialogTitle>
          <DialogDescription>
            Choose a template to quickly create a set of related tasks
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {TASK_TEMPLATES.map((template) => {
            const IconComponent = ICON_MAP[template.icon];
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {template.tasks.length} tasks:
                    </div>
                    {template.tasks.slice(0, 3).map((task, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span>{task.title}</span>
                      </div>
                    ))}
                    {template.tasks.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        +{template.tasks.length - 3} more...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
