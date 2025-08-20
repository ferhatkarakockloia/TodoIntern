import { useMemo, useState } from "react";
import {
  Calendar as RBCalendar,
  dateFnsLocalizer,
  type SlotInfo,
  type View,
  type ToolbarProps as RBToolbarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { tr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Timestamp } from "firebase/firestore";
import { useTodoContext } from "../../context/todocontext/todo-context";
import type { Task } from "../../context/todocontext/types";

const locales = { tr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const toISOLocal = (d: Date | null) =>
  d
    ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  resource: Task;
};

function Toolbar(props: RBToolbarProps<CalendarEvent, object>) {
  const { onNavigate, onView, label, view } = props;

  const tabBtn =
    "px-3 py-1 rounded-md text-sm font-medium border border-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-[#F6F0D6] hover:bg-white/10 transition";
  const navBtn =
    "inline-flex items-center justify-center rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10";

  return (
    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button
          className={navBtn}
          onClick={() => onNavigate("TODAY")}
          aria-label="Bugün"
        >
          Bugün
        </button>
        <div className="flex items-center gap-1">
          <button
            className={navBtn}
            onClick={() => onNavigate("PREV")}
            aria-label="Önceki"
            title="Önceki"
          >
            ‹
          </button>
          <div className="px-3 text-[#E9DFB3] font-semibold">{label}</div>
          <button
            className={navBtn}
            onClick={() => onNavigate("NEXT")}
            aria-label="Sonraki"
            title="Sonraki"
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          data-active={view === "month"}
          className={tabBtn}
          onClick={() => onView?.("month")}
        >
          Month
        </button>
        <button
          data-active={view === "week"}
          className={tabBtn}
          onClick={() => onView?.("week")}
        >
          Week
        </button>
        <button
          data-active={view === "day"}
          className={tabBtn}
          onClick={() => onView?.("day")}
        >
          Day
        </button>
        <button
          data-active={view === "agenda"}
          className={tabBtn}
          onClick={() => onView?.("agenda")}
        >
          Agenda
        </button>
      </div>
    </div>
  );
}

const Calendar = () => {
  const { allTasks, addTodo, updateTodo, deleteTodo } = useTodoContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [slotStart, setSlotStart] = useState<Date | null>(null);
  const [slotEnd, setSlotEnd] = useState<Date | null>(null);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date());

  const events = useMemo<CalendarEvent[]>(
    () =>
      allTasks.map((t) => {
        const start =
          (t.startAt as Date | null) ??
          (t.dueAt as Date | null) ??
          new Date(new Date().setHours(12, 0, 0, 0));
        const end =
          (t.dueAt as Date | null) ??
          (t.startAt as Date | null) ??
          new Date(new Date().setHours(13, 0, 0, 0));
        return {
          title: t.title,
          start,
          end,
          resource: t,
        };
      }),
    [allTasks]
  );

  const handleSelectSlot = (slot: SlotInfo) => {
    setEditing(null);
    setSlotStart(slot.start as Date);
    setSlotEnd((slot.end as Date) ?? (slot.start as Date));
    setModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setEditing(event.resource);
    setSlotStart(event.start);
    setSlotEnd(event.end);
    setModalOpen(true);
  };

  const eventPropGetter = (e: CalendarEvent) => {
    const p = e.resource.priority ?? "medium";
    const bg =
      p === "high"
        ? "bg-red-500/30 border-red-400/40"
        : p === "low"
        ? "bg-emerald-500/25 border-emerald-400/40"
        : "bg-amber-500/25 border-amber-400/40";
    return {
      className:
        "rounded-md !border " +
        bg +
        " text-[#F6F0D6] hover:!brightness-110 transition",
    };
  };

  return (
    <div className="p-4 h-[calc(100vh-2rem)] bg-[#15120e] text-[#F6F0D6]">
      <div className="mx-auto h-full w-full max-w-7xl rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#E9DFB3]">Takvim</h2>
          <button
            onClick={() => {
              setEditing(null);
              setSlotStart(new Date());
              setSlotEnd(new Date(new Date().getTime() + 60 * 60 * 1000));
              setModalOpen(true);
            }}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10"
          >
            + Yeni Görev
          </button>
        </div>

        <RBCalendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onView={(v) => setView(v)}
          onNavigate={(d) => setDate(d)}
          views={["month", "week", "day", "agenda"]}
          popup
          selectable
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 180px)" }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          components={{ toolbar: Toolbar }}
          messages={{
            week: "Hafta",
            work_week: "İş Haftası",
            day: "Gün",
            month: "Ay",
            previous: "Önceki",
            next: "Sonraki",
            today: "Bugün",
            agenda: "Ajanda",
            date: "Tarih",
            time: "Saat",
            event: "Etkinlik",
            noEventsInRange: "Bu aralıkta etkinlik yok",
            showMore: (total) => `+${total} daha`,
          }}
        />
      </div>

      {modalOpen && (
        <TaskModal
          open={modalOpen}
          editingTask={editing}
          initialStart={slotStart}
          initialEnd={slotEnd}
          onClose={() => setModalOpen(false)}
          onCreate={async ({
            title,
            description,
            startAt,
            dueAt,
            priority,
          }) => {
            await addTodo({
              title: title.trim(),
              description: description.trim(),
              startAt: startAt ? Timestamp.fromDate(startAt) : null,
              dueAt: Timestamp.fromDate(dueAt),
              priority,
            });
          }}
          onUpdate={async (task, patch) => {
            await updateTodo(task.id, {
              ...(patch.title !== undefined ? { title: patch.title } : {}),
              ...(patch.description !== undefined
                ? { description: patch.description }
                : {}),
              ...(patch.priority !== undefined
                ? { priority: patch.priority }
                : {}),
              ...(patch.startAt !== undefined
                ? {
                    startAt: patch.startAt
                      ? Timestamp.fromDate(patch.startAt)
                      : null,
                  }
                : {}),
              ...(patch.dueAt !== undefined
                ? { dueAt: Timestamp.fromDate(patch.dueAt) }
                : {}),
            });
          }}
          onDelete={async (task) => {
            await deleteTodo(task.id);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

type TaskModalProps = {
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
        await onUpdate(editingTask, {
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
    } catch (e: any) {
      setErr(e?.message ?? "Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !editingTask) return;
    try {
      setSaving(true);
      await onDelete(editingTask);
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? "Silme sırasında bir hata oluştu.");
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
