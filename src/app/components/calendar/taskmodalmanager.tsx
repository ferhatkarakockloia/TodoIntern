import TaskModal from "./calendartaskmodal.tsx";
import type { Task } from "../../context/todocontext/types";

export interface ModalTaskData {
  title: string;
  description?: string;
  startAt?: Date | null;
  dueAt: Date;
  priority?: "low" | "medium" | "high";
}

interface TaskModalManagerProps {
  modalOpen: boolean;
  editingTask: Task | null;
  initialStart: Date | null;
  initialEnd: Date | null;
  onClose: () => void;
  onCreate: (data: ModalTaskData) => Promise<void>;
  onUpdate: (task: Task, patch: Partial<ModalTaskData>) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
}

const TaskModalManager = ({
  modalOpen,
  editingTask,
  initialStart,
  initialEnd,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: TaskModalManagerProps) => {
  if (!modalOpen) {
    return null;
  }

  return (
    <TaskModal
      open={modalOpen}
      editingTask={editingTask}
      initialStart={initialStart}
      initialEnd={initialEnd}
      onClose={onClose}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
};

export default TaskModalManager;