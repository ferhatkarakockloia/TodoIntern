import TaskCard from "./TaskCard";
import type { Task, TaskUpdate } from "../../context/todocontext/types";

type Props = {
  title: string;
  tasks: Task[];
  updatingIds: Record<string, boolean>;
  onToggle: (taskId: string, value: boolean) => Promise<void>;
  onUpdate?: (taskId: string, data: Partial<TaskUpdate>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  emptyText?: string;
  className?: string;
};

export default function TaskSection({
  title,
  tasks,
  updatingIds,
  onToggle,
  onUpdate,
  onDelete,
  emptyText = "Görev yok.",
  className = "",
}: Props) {
  return (
    <section className={className}>
      <h2 className="text-2xl font-bold text-[#E9DFB3] mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.length === 0 && <p className="text-[#C8B88A]">{emptyText}</p>}
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
            busy={!!updatingIds[t.id]}
          />
        ))}
      </div>
    </section>
  );
}