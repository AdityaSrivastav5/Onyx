"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Circle,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "P1" | "P2" | "P3" | "P4";
  dueDate?: string;
  labels: string[];
  timeEstimate?: number;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskClick?: (task: Task) => void;
}

const PRIORITY_CONFIG = {
  P1: { label: "Urgent", color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400", icon: "🔥" },
  P2: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400", icon: "⚡" },
  P3: { label: "Medium", color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400", icon: "📌" },
  P4: { label: "Low", color: "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400", icon: "📋" },
};

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-blue-500" },
  { id: "in-progress", title: "In Progress", color: "bg-yellow-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
] as const;

export function KanbanBoard({ tasks, onTaskUpdate, onTaskClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as "todo" | "in-progress" | "done";
    
    // Check if dropped on a column
    if (COLUMNS.some(col => col.id === newStatus)) {
      const task = tasks.find(t => t._id === taskId);
      if (task && task.status !== newStatus) {
        await onTaskUpdate(taskId, { status: newStatus });
      }
    }
    
    setActiveId(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const activeTask = tasks.find(task => task._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface KanbanColumnProps {
  column: typeof COLUMNS[number];
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${column.color}`} />
        <h3 className="font-semibold text-sm uppercase tracking-wide">
          {column.title}
        </h3>
        <Badge variant="secondary" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>

      <SortableContext
        items={tasks.map(t => t._id)}
        strategy={verticalListSortingStrategy}
        id={column.id}
      >
        <div className="flex-1 space-y-3 min-h-[200px] p-4 rounded-lg bg-muted/20 border-2 border-dashed border-muted-foreground/20">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

interface SortableTaskCardProps {
  task: Task;
  onClick?: () => void;
}

function SortableTaskCard({ task, onClick }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        dragHandleProps={{ ...attributes, ...listeners }}
        onClick={onClick}
        isDragging={isDragging}
      />
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  dragHandleProps?: any;
  onClick?: () => void;
  isDragging?: boolean;
}

function TaskCard({ task, dragHandleProps, onClick, isDragging }: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <Card
      className={cn(
        "group cursor-pointer hover:shadow-md transition-all",
        isDragging && "shadow-lg ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <h4 className="font-medium text-sm line-clamp-2 flex-1">
                {task.title}
              </h4>
              {priorityConfig && (
                <Badge
                  variant="outline"
                  className={cn("text-xs shrink-0", priorityConfig.color)}
                >
                  {priorityConfig.icon}
                </Badge>
              )}
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {task.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {task.dueDate && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {task.dueDate}
                </span>
              )}
              {task.timeEstimate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.timeEstimate}m
                </span>
              )}
            </div>

            {/* Labels */}
            {task.labels.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {task.labels.slice(0, 2).map((label, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {task.labels.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{task.labels.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
