import type { Task } from "../../context/todocontext/types";
import { fmtDT } from "../../utils/datetime";

const Chip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-[#E9DFB3] border border-white/10">
    {label}
  </span>
);

type TaskCardProps = {
  task: Task;
  onToggle: (taskId: string, value: boolean) => Promise<void>;
  busy?: boolean;
};

export default function TaskCard({ task, onToggle, busy }: TaskCardProps) {
  const startStr = fmtDT(task.startAt);
  const dueStr = fmtDT(task.dueAt);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border-white/30 bg-transparent accent-[#E9DFB3] cursor-pointer disabled:opacity-50"
          checked={!!task.completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
          disabled={busy}
          aria-label={task.completed ? "Görevi geri al" : "Görevi tamamla"}
          title={task.completed ? "Tamamlandı olarak işaretlendi" : "Tamamla"}
        />
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-[#F6F0D6]">{task.title}</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {task.chips?.map((c, i) => (
              <Chip key={i} label={c} />
            ))}
            {task.priority && <Chip label={`Öncelik: ${task.priority}`} />}
            {startStr && <Chip label={`Başlangıç: ${startStr}`} />}
            {dueStr && <Chip label={`Bitiş: ${dueStr}`} />}
            {task.completed && <Chip label="✔ Tamamlandı" />}
          </div>
        </div>
      </div>
    </div>
  );
}
