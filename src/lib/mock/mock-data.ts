import type {
  AssistantState,
  CalendarViewData,
  DayPlan,
  Task,
  UserProfile,
} from "@/types/domain";

export const mockProfile: UserProfile = {
  id: "user-1",
  displayName: "On Point User",
  isStudent: true,
  sleep: {
    defaultWakeTime: "07:00",
    goalHours: 8,
    minimumHours: 6.5,
  },
  defaults: {
    travelMinutes: 25,
    prepMinutes: 15,
    recoveryMinutes: 20,
  },
  productiveWindows: [
    { start: "08:30", end: "12:00" },
    { start: "14:00", end: "18:30" },
  ],
  sacrificePreferences: [
    "protect-class-work",
    "protect-min-sleep",
    "drop-optional-first",
  ],
};

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Chemistry lab prep",
    type: "time-restricted",
    priority: "critical",
    status: "in-progress",
    estimatedMinutes: 60,
    deadline: "2026-03-12T14:00:00",
  },
  {
    id: "task-2",
    title: "Gym session",
    type: "flexible",
    priority: "important",
    status: "not-started",
    estimatedMinutes: 120,
  },
  {
    id: "task-3",
    title: "Journal and reflection",
    type: "optional",
    priority: "optional",
    status: "not-started",
    estimatedMinutes: 20,
  },
];

export const mockCurrentDay: DayPlan = {
  date: "2026-03-12",
  currentTask: "Chemistry lab prep",
  nextTask: "Class: Systems Engineering",
  warnings: ["Sleep minimum at risk", "Tight transition before next class"],
  timeline: [
    { id: "t1", label: "Sleep", type: "sleep", start: "00:15", end: "07:00" },
    { id: "t2", label: "Prep", type: "prep", start: "07:00", end: "07:20" },
    { id: "t3", label: "Travel to campus", type: "travel", start: "07:20", end: "07:50" },
    { id: "t4", label: "Class: Math", type: "class", start: "08:00", end: "09:20" },
    { id: "t5", label: "Chemistry lab prep", type: "task", start: "09:40", end: "10:40" },
    { id: "t6", label: "Class: Systems Engineering", type: "class", start: "11:00", end: "12:20" },
  ],
};

export const mockCalendar: CalendarViewData = {
  daily: [
    { id: "c1", title: "Class: Math", start: "08:00", end: "09:20" },
    { id: "c2", title: "Lab", start: "13:00", end: "14:00" },
    { id: "c3", title: "Gym", start: "17:30", end: "19:00" },
  ],
  weekly: [
    { day: "Mon", summary: "2 classes · 1 study block" },
    { day: "Tue", summary: "3 classes · gym" },
    { day: "Wed", summary: "Lab day · errands" },
    { day: "Thu", summary: "2 classes · deep work" },
    { day: "Fri", summary: "Work shift · review" },
    { day: "Sat", summary: "Flexible tasks · recovery" },
  ],
};

export const mockAssistant: AssistantState = {
  messages: [
    {
      id: "m1",
      role: "assistant",
      text: "Your class block is fixed. I can compress optional items and protect minimum sleep.",
      createdAt: "2026-03-12T08:10:00",
    },
    {
      id: "m2",
      role: "user",
      text: "If lab runs long, shift gym and keep my sleep floor.",
      createdAt: "2026-03-12T08:12:00",
    },
    {
      id: "m3",
      role: "assistant",
      text: "Copy. Keep it sharp and lock in twin.",
      createdAt: "2026-03-12T08:12:30",
    },
  ],
  quickActions: [
    { id: "qa-1", label: "Rebuild my day" },
    { id: "qa-2", label: "Add blocker" },
    { id: "qa-3", label: "Protect sleep minimum" },
    { id: "qa-4", label: "Suggest next action" },
  ],
};
