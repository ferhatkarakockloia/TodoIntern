import { useMemo, useState } from "react";
import { type View, type SlotInfo } from "react-big-calendar";
import { Timestamp } from "firebase/firestore";
import { useTodoContext } from "../../context/todocontext/todo-context";
import type { CalendarEvent } from "../../type";
import type { Task } from "../../context/todocontext/types";
import CalendarView from "../../components/calendar/reactbigcalendar.tsx";
import TaskModalManager from "../../components/calendar/taskmodalmanager.tsx";

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

        <CalendarView
          events={events}
          date={date}
          view={view}
          onView={(v) => setView(v)}
          onNavigate={(d) => setDate(d)}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
        />
      </div>

      <TaskModalManager
        modalOpen={modalOpen}
        editingTask={editing}
        initialStart={slotStart}
        initialEnd={slotEnd}
        onClose={() => setModalOpen(false)}
        onCreate={async (data) => {
          const { title, description, startAt, dueAt, priority } = data;
          await addTodo({
            title: title?.trim() ?? "",
            description: description?.trim() ?? "",
            startAt: startAt ? Timestamp.fromDate(startAt) : null,
            dueAt: Timestamp.fromDate(dueAt ?? new Date()),
            priority: priority ?? "medium",
          });
        }}
        onUpdate={async (task, patch) => {
          await updateTodo(task.id, {
            title: patch.title?.trim(),
            description: patch.description?.trim(),
            priority: patch.priority,
            startAt:
              patch.startAt !== undefined
                ? patch.startAt
                  ? Timestamp.fromDate(patch.startAt)
                  : null
                : undefined,
            dueAt:
              patch.dueAt !== undefined
                ? Timestamp.fromDate(patch.dueAt)
                : undefined,
          });
        }}
        onDelete={async (task) => {
          await deleteTodo(task.id);
        }}
      />
    </div>
  );
};

export default Calendar;