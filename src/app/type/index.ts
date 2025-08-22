import type { Task } from "../../app/context/todocontext/types";

export interface SidebarProps {
  isPanelOpen: boolean;
  onPanelClose?: () => void;
}

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  resource: Task;
};

export type TaskModalProps = {
  open: boolean;
  editingTask: Task | null;
  initialStart: Date | null;
  initialEnd: Date | null;
  onClose: () => void;
  onCreate: (p: {
    title: string;
    description: string;
    startAt: Date | null;
    dueAt: Date;
    priority: "low" | "medium" | "high";
  }) => Promise<void>;
  onUpdate: (
    task: Task,
    patch: Partial<{
      title: string;
      description: string;
      startAt: Date | null;
      dueAt: Date;
      priority: "low" | "medium" | "high";
    }>
  ) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
};