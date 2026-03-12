export type TaskType =
  | "fixed"
  | "flexible"
  | "splittable"
  | "optional"
  | "recurring"
  | "time-restricted";

export type TaskPriority =
  | "critical"
  | "essential"
  | "important"
  | "optional"
  | "leisure";

export type TaskStatus = "not-started" | "in-progress" | "done" | "deferred";

export type TimelineEntryType =
  | "sleep"
  | "class"
  | "work"
  | "task"
  | "prep"
  | "travel"
  | "recovery"
  | "buffer"
  | "break"
  | "blocker";

export type BlockerType =
  | "overslept"
  | "unexpected-call"
  | "travel-delay"
  | "emotional-exhaustion"
  | "family-interruption"
  | "last-minute-meeting"
  | "technical-issue"
  | "illness-burnout"
  | "other";

export type OverrunAction = "done" | "add-default" | "add-custom" | "move-remaining";

export type SacrificePreference =
  | "protect-class-work"
  | "protect-min-sleep"
  | "drop-leisure-first"
  | "drop-optional-first"
  | "prefer-gym-over-entertainment"
  | "prefer-sleep-over-gym";

export type ProductiveWindow = {
  start: string;
  end: string;
};

export type SleepSettings = {
  defaultWakeTime: string;
  goalHours: number;
  minimumHours: number;
};

export type UserDefaults = {
  travelMinutes: number;
  prepMinutes: number;
  recoveryMinutes: number;
};

export type UserProfile = {
  id: string;
  displayName: string;
  isStudent: boolean;
  sleep: SleepSettings;
  defaults: UserDefaults;
  productiveWindows: ProductiveWindow[];
  sacrificePreferences: SacrificePreference[];
};

export type Task = {
  id: string;
  title: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedMinutes: number;
  deadline?: string;
  timeWindow?: {
    earliestStart?: string;
    latestEnd?: string;
  };
  recurringRule?: string;
};

export type TimelineEntry = {
  id: string;
  label: string;
  type: TimelineEntryType;
  start: string;
  end: string;
  taskId?: string;
};

export type DayPlan = {
  date: string;
  currentTask: string;
  nextTask: string;
  warnings: string[];
  timeline: TimelineEntry[];
};

export type BlockerInput = {
  type: BlockerType;
  title: string;
  lostMinutes: number;
};

export type ScheduleChangeSummary = {
  moved: string[];
  shortened: string[];
  sacrificed: string[];
  warnings: string[];
  notes: string[];
};

export type ScheduleRebuildResult = {
  plan: DayPlan;
  summary: ScheduleChangeSummary;
};

export type FreeTimeSuggestion = {
  id: string;
  label: string;
  reason: string;
};

export type CalendarDaySummary = {
  day: string;
  summary: string;
};

export type CalendarEntry = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export type CalendarViewData = {
  daily: CalendarEntry[];
  weekly: CalendarDaySummary[];
};

export type AssistantRole = "user" | "assistant" | "system";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  text: string;
  createdAt: string;
};

export type AssistantQuickAction = {
  id: string;
  label: string;
};

export type AssistantState = {
  messages: AssistantMessage[];
  quickActions: AssistantQuickAction[];
};
