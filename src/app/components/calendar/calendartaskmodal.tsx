import { useState } from "react";
import type { TaskModalProps } from "../../type";
import type { Task } from "../../context/todocontext/types";

const toISOLocal = (d: Date | null) =>
  d
    ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

function TaskModal({
  open,
  editingTask,
  initialStart,
  initialEnd,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: TaskModalProps) {
  const isEdit = !!editingTask;

  const [title, setTitle] = useState<string>(editingTask?.title ?? "");
  const [description, setDescription] = useState<string>(
    editingTask?.description ?? ""
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    editingTask?.priority ?? "medium"
  );
  const [startAt, setStartAt] = useState<Date | null>(
    (editingTask?.startAt as Date | null) ?? initialStart
  );
  const [dueAt, setDueAt] = useState<Date>(
    (editingTask?.dueAt as Date | null) ?? initialEnd ?? new Date()
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = async () => {
    setErr(null);
    if (!title.trim()) {
      setErr("Başlık zorunlu.");
      return;
    }
    if (!dueAt) {
      setErr("Bitiş (Due) zorunlu.");
      return;
    }
    if (startAt && startAt > dueAt) {
      setErr("Bitiş tarihi başlangıçtan sonra olmalı.");
      return;
    }

    try {
      setSaving(true);
      if (isEdit && editingTask) {
        await onUpdate(editingTask as Task, {
          title: title.trim(),
          description: description.trim(),
          startAt,
          dueAt,
          priority,
        });
      } else {
        await onCreate({
          title: title.trim(),
          description: description.trim(),
          startAt,
          dueAt,
          priority,
        });
      }
      onClose();
    } catch (e: unknown) {
      // Corrected line
      setErr(
        e instanceof Error ? e.message : "Kaydetme sırasında bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !editingTask) return;
    try {
      setSaving(true);
      await onDelete(editingTask as Task);
      onClose();
    } catch (e: unknown) {
      // Corrected line
      setErr(
        e instanceof Error ? e.message : "Silme sırasında bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  };

  const badge =
    priority === "high"
      ? "bg-red-500/20 text-red-200 border-red-400/30"
      : priority === "low"
      ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
      : "bg-amber-500/20 text-amber-100 border-amber-400/30";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#1d1a16] border border-white/10 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#E9DFB3]">
            {isEdit ? "Görevi Düzenle" : "Yeni Görev"}
          </h3>
          <span className={`rounded-full border px-3 py-1 text-xs ${badge}`}>
            Öncelik: {priority}
          </span>
        </div>

        {err && (
          <div className="mb-3 rounded border border-red-400 bg-red-500/10 px-3 py-2 text-red-200">
            {err}
          </div>
        )}

        <div className="space-y-3">
          <input
            className="w-full border border-white/10 bg-white/5 text-[#F6F0D6] placeholder:text-[#b7ab82] p-2 rounded"
            placeholder="Başlık *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={4}
            className="w-full border border-white/10 bg-white/5 text-[#F6F0D6] placeholder:text-[#b7ab82] p-2 rounded"
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm text-[#E9DFB3]">
              Başlangıç (opsiyonel)
              <input
                type="datetime-local"
                className="mt-1 w-full border border-white/10 bg-white/5 text-[#F6F0D6] p-2 rounded"
                value={toISOLocal(startAt)}
                onChange={(e) =>
                  setStartAt(e.target.value ? new Date(e.target.value) : null)
                }
              />
            </label>
            <label className="text-sm text-[#E9DFB3]">
              Bitiş (Due) *
              <input
                type="datetime-local"
                className="mt-1 w-full border border-white/10 bg-white/5 text-[#F6F0D6] p-2 rounded"
                value={toISOLocal(dueAt)}
                onChange={(e) => setDueAt(new Date(e.target.value))}
              />
            </label>
          </div>

          <label className="text-sm text-[#E9DFB3]">
            Öncelik
            <select
              className="mt-1 w-full border border-white/10 bg-white/5 text-[#F6F0D6] p-2 rounded"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between">
          {isEdit ? (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 rounded bg-red-600 text-white hover:brightness-110 disabled:opacity-60"
            >
              Sil
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded border border-white/10 hover:bg-white/10"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;