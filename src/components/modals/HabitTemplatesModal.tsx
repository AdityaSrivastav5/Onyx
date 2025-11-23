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
import { HABIT_TEMPLATES } from "@/lib/templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface HabitTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (habits: any[]) => void;
}

export function HabitTemplatesModal({ isOpen, onClose, onSelectTemplate }: HabitTemplatesModalProps) {
  const handleSelectTemplate = (template: typeof HABIT_TEMPLATES[0]) => {
    onSelectTemplate(template.habits);
    toast.success(`${template.name} template applied!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Habit Templates</DialogTitle>
          <DialogDescription>
            Choose a template to quickly create a set of related habits
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {HABIT_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {template.habits.length} habits:
                  </div>
                  {template.habits.map((habit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full bg-${habit.color}-500 shrink-0 mt-0.5`} />
                      <div>
                        <div className="font-medium">{habit.name}</div>
                        <div className="text-xs text-muted-foreground">{habit.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
