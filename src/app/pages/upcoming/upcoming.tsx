import { useMemo } from "react";
import { useTodoContext } from "../../context/todocontext/todo-context";
import TaskSection from "../../components/tasks/TaskSection";

export default function Upcoming() {
  const { allTasks, loading, updatingIds, toggleCompleted, deleteTodo } =
    useTodoContext();

  const sortedUpcomingTasks = useMemo(() => {
    const incompleteTasks = allTasks.filter((task) => !task.completed);

    return incompleteTasks.sort((a, b) => {
      if (!a.dueAt && !b.dueAt) return 0;
      if (!a.dueAt) return 1;
      if (!b.dueAt) return -1;

      const aTime = a.dueAt.getTime();
      const bTime = b.dueAt.getTime();
      return aTime - bTime;
    });
  }, [allTasks]);

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-[#C8B88A]">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <section className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#E9DFB3]">Yaklaşanlar</h1>
        <p className="mt-2 text-[#C8B88A]">
          {sortedUpcomingTasks.length > 0
            ? "Tüm yaklaşan görevlerin burada listeleniyor."
            : "Henüz yaklaşan bir görevin yok, harika!"}
        </p>
      </section>

      <TaskSection
        title=""
        tasks={sortedUpcomingTasks}
        updatingIds={updatingIds}
        onToggle={toggleCompleted}
        onDelete={deleteTodo}
        emptyText="Yaklaşan herhangi bir görev bulunmuyor."
      />
    </div>
  );
}