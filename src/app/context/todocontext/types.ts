export type Task = {
  id: string;
  title: string;
  chips: string[];
  priority?: "low" | "medium" | "high";
  completed: boolean;
  startAt: Date | null;
  dueAt: Date | null;
};

export type TodoContextType = {
  allTasks: Task[];
  todayTasks: Task[];
  weekTasks: Task[];
  loading: boolean;
  updatingIds: Record<string, boolean>;
  toggleCompleted: (taskId: string, value: boolean) => Promise<void>;
  addTodo: (title: string, dueAtTime?: string) => Promise<void>;
  deleteTodo: (taskId: string) => Promise<void>;
  updateTodo: (taskId: string, data: Partial<Task>) => Promise<void>; // <-- Yeni
};