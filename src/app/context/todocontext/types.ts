import { Timestamp } from "firebase/firestore";

export type Task = {
  id: string;
  title: string;
  description?: string;            
  chips: string[];
  priority?: "low" | "medium" | "high";
  completed: boolean;
  startAt: Date | null;
  dueAt: Date | null;
};

export type TaskUpdate = {
  title?: string;
  description?: string;            
  chips?: string[];
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  startAt?: Timestamp | null;
  dueAt?: Timestamp | null;
};

export type AddTodoInput = {
  title: string;
  description?: string;
  startAt?: Timestamp | null;      
  dueAt: Timestamp;               
  priority?: "low" | "medium" | "high";
  chips?: string[];                
};

export type TodoContextType = {
  allTasks: Task[];
  todayTasks: Task[];
  weekTasks: Task[];
  // Yeni eklenen kısım
  pastTasks: Task[];
  loading: boolean;
  updatingIds: Record<string, boolean>;
  toggleCompleted: (taskId: string, value: boolean) => Promise<void>;
  addTodo: (input: AddTodoInput) => Promise<void>;          
  deleteTodo: (taskId: string) => Promise<void>;
  updateTodo: (taskId: string, data: Partial<TaskUpdate>) => Promise<void>;
};