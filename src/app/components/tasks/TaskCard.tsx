import { useState } from "react";
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
  onUpdate?: (taskId: string, data: Partial<Task>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  busy?: boolean;
};

export default function TaskCard({ task, onToggle, onUpdate, onDelete, busy }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const startStr = fmtDT(task.startAt);
  const dueStr = fmtDT(task.dueAt);

  const handleUpdateTitle = async () => {
    if (!onUpdate) return;
    if (editedTitle.trim() === "" || editedTitle === task.title) {
      setIsEditing(false);
      return;
    }

    try {
      await onUpdate(task.id, { title: editedTitle.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task title:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

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
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={handleKeyDown}
              disabled={busy}
              autoFocus
              className="w-full bg-transparent border-b-2 border-slate-500 text-[#F6F0D6] placeholder-slate-400 focus:outline-none focus:border-[#E9DFB3] transition-colors text-lg font-semibold"
            />
          ) : (
            <h4
              className="text-lg font-semibold text-[#F6F0D6]"
              onDoubleClick={() => setIsEditing(true)}
              title="Başlığı düzenlemek için çift tıklayın."
            >
              {task.title}
            </h4>
          )}
          
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

        <div className="flex gap-1">
            {onUpdate && (
                <button
                    onClick={() => setIsEditing(true)}
                    disabled={busy}
                    className="p-2 text-slate-400 hover:text-[#E9DFB3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Görevi düzenle"
                    title="Görevi düzenle"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
            )}
            {onDelete && (
                <button
                    onClick={() => onDelete(task.id)}
                    disabled={busy}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Görevi sil"
                    title="Görevi sil"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    >
                    <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89a.996.996 0 0 0 0-1.4z" />
                    </svg>
                </button>
            )}
        </div>
      </div>
    </div>
  );
}