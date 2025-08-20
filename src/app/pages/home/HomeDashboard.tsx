import { useMemo } from "react";
import { useTodoContext } from "../../context/todocontext/todo-context";
import TaskSection from "../../components/tasks/TaskSection";
import CalendarPanel from "../../components/calendar/CalendarPanel";

export default function HomeDashboard() {
  const {
    todayTasks,
    weekTasks,
    allTasks,
    loading,
    updatingIds,
    toggleCompleted,
    updateTodo,
    deleteTodo,
  } = useTodoContext();

  const hasAnyTask = useMemo(() => (allTasks?.length ?? 0) > 0, [allTasks]);

  return (
    <div className="w-full">
      <section className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#E9DFB3]">Merhaba!</h1>
        <p className="mt-2 text-[#C8B88A]">
          {hasAnyTask
            ? "Günün planını birlikte yapalım."
            : "Henüz görev yok, bir tane eklemeye ne dersin?"}
        </p>
      </section>

      {loading ? (
        <p className="text-[#C8B88A]">Yükleniyor…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <TaskSection
              title="Bugün"
              tasks={todayTasks}
              updatingIds={updatingIds}
              onToggle={toggleCompleted}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              emptyText="Bugün için görev yok."
            />
            <TaskSection
              title="Bu Hafta"
              tasks={weekTasks}
              updatingIds={updatingIds}
              onToggle={toggleCompleted}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              emptyText="Bu hafta için görev yok."
              className="pb-8"
            />
          </div>

          <aside className="lg:col-span-1">
            <CalendarPanel />
          </aside>
        </div>
      )}
    </div>
  );
}
