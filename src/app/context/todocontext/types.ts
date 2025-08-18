import type { Timestamp } from "firebase/firestore";

export type Task = {
  id: string;
  title: string;
  chips: string[];
  priority?: "high" | "medium" | "low";
  startAt?: Date | null;
  dueAt?: Date | null;
  completed?: boolean;
};

export type TodoContextType = {
  allTasks: Task[];
  todayTasks: Task[];
  weekTasks: Task[];
  loading: boolean;
  updatingIds: Record<string, boolean>;
  toggleCompleted: (taskId: string, value: boolean) => Promise<void>;
};