"use client";

import { createContext, useContext, useState } from "react";

import { mockCalendar, mockTasks } from "@/lib/mock/mock-data";
import type { Task, TaskPriority, TaskType } from "@/types/domain";

export type PlannerEvent = {
  id: string;
  title: string;
  startIso: string;
  endIso: string;
  source: "task" | "calendar" | "ai";
  taskId?: string;
};

type PlannerContextValue = {
  tasks: Task[];
  events: PlannerEvent[];
  addTask: (input: { title: string; type: TaskType; priority: TaskPriority; estimatedMinutes: number }) => Task;
  updateTask: (id: string, input: { title: string; type: TaskType; priority: TaskPriority; estimatedMinutes: number }) => Task | null;
  markTaskDoneByTitle: (title: string) => Task | null;
  addEvent: (input: { title: string; startIso: string; endIso: string; source: "calendar" | "ai"; taskId?: string }) => PlannerEvent;
  runAssistantCommand: (prompt: string) => string;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

function createInitialEvents(): PlannerEvent[] {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  return mockCalendar.daily.map((entry) => ({
    id: entry.id,
    title: entry.title,
    startIso: `${dateKey}T${entry.start}:00`,
    endIso: `${dateKey}T${entry.end}:00`,
    source: "calendar" as const,
  }));
}

function addMinutes(dateIso: string, minutes: number): string {
  const date = new Date(dateIso);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function parseTimeToday(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [events, setEvents] = useState<PlannerEvent[]>(createInitialEvents);

  function addTask(input: { title: string; type: TaskType; priority: TaskPriority; estimatedMinutes: number }) {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: input.title,
      type: input.type,
      priority: input.priority,
      status: "not-started",
      estimatedMinutes: input.estimatedMinutes,
    };

    setTasks((prev) => [task, ...prev]);

    const startIso = addMinutes(new Date().toISOString(), 20);
    const endIso = addMinutes(startIso, input.estimatedMinutes);
    setEvents((prev) => [
      {
        id: `event-${Date.now()}`,
        title: task.title,
        startIso,
        endIso,
        source: "task",
        taskId: task.id,
      },
      ...prev,
    ]);

    return task;
  }

  function updateTask(
    id: string,
    input: { title: string; type: TaskType; priority: TaskPriority; estimatedMinutes: number },
  ) {
    let updatedTask: Task | null = null;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) {
          return task;
        }

        updatedTask = {
          ...task,
          title: input.title,
          type: input.type,
          priority: input.priority,
          estimatedMinutes: input.estimatedMinutes,
        };

        return updatedTask;
      }),
    );

    setEvents((prev) =>
      prev.map((event) => {
        if (event.taskId !== id) {
          return event;
        }

        return {
          ...event,
          title: input.title,
          endIso: addMinutes(event.startIso, input.estimatedMinutes),
        };
      }),
    );

    return updatedTask;
  }

  function markTaskDoneByTitle(title: string) {
    const normalized = title.toLowerCase();
    const target = tasks.find((task) => task.title.toLowerCase().includes(normalized));

    if (!target) {
      return null;
    }

    const updated: Task = { ...target, status: "done" };

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== target.id) {
          return task;
        }

        return updated;
      }),
    );

    return updated;
  }

  function addEvent(input: { title: string; startIso: string; endIso: string; source: "calendar" | "ai"; taskId?: string }) {
    const event: PlannerEvent = {
      id: `event-${Date.now()}`,
      title: input.title,
      startIso: input.startIso,
      endIso: input.endIso,
      source: input.source,
      taskId: input.taskId,
    };

    setEvents((prev) => [event, ...prev]);
    return event;
  }

  function runAssistantCommand(prompt: string): string {
    const text = prompt.trim();
    const lower = text.toLowerCase();

    const addTaskMatch = text.match(/add task\s+(.+?)(?:\s+for\s+(\d+)\s*min)?$/i);
    if (addTaskMatch) {
      const title = addTaskMatch[1].trim();
      const minutes = Number(addTaskMatch[2] ?? 45);
      addTask({
        title,
        type: "flexible",
        priority: "important",
        estimatedMinutes: minutes,
      });
      return `Added task "${title}" and placed it on your calendar.`;
    }

    const scheduleMatch = text.match(/schedule\s+(.+?)\s+at\s+(\d{1,2}:\d{2})(?:\s+for\s+(\d+)\s*min)?$/i);
    if (scheduleMatch) {
      const title = scheduleMatch[1].trim();
      const start = parseTimeToday(scheduleMatch[2]);
      const minutes = Number(scheduleMatch[3] ?? 60);
      addEvent({
        title,
        startIso: start,
        endIso: addMinutes(start, minutes),
        source: "ai",
      });
      return `Scheduled "${title}" at ${scheduleMatch[2]} for ${minutes} min.`;
    }

    const doneMatch = text.match(/(mark|set)\s+(.+?)\s+(done|complete)/i);
    if (doneMatch) {
      const title = doneMatch[2].trim();
      const updated = markTaskDoneByTitle(title);
      if (updated) {
        return `Marked "${updated.title}" as done.`;
      }
      return `I couldn't find a task matching "${title}".`;
    }

    if (lower.includes("show") && lower.includes("calendar")) {
      return `You have ${events.length} calendar items currently tracked.`;
    }

    return "I can update your plan. Try: 'add task review notes for 30 min' or 'schedule meeting at 15:00 for 45 min'.";
  }

  const value: PlannerContextValue = {
    tasks,
    events,
    addTask,
    updateTask,
    markTaskDoneByTitle,
    addEvent,
    runAssistantCommand,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlanner must be used inside PlannerProvider.");
  }
  return context;
}
