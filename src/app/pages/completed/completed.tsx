import { useMemo } from "react";
import { useTodoContext } from "../../context/todocontext/todo-context";
import TaskSection from "../../components/tasks/TaskSection";

export default function Completed() {
  const { allTasks, loading, updatingIds, toggleCompleted } =
    useTodoContext();

  const completedTasks = useMemo(() => {
    return allTasks.filter((task) => task.completed);
  }, [allTasks]);

  if (loading) {
    return (
      <div className="w-full">
        <p className="text-[#C8B88A]">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#E9DFB3]">Tamamlanan Görevler</h1>
        <p className="mt-2 text-[#C8B88A]">
          {completedTasks.length > 0
            ? "Tebrikler! İşte tamamladığın görevlerin."
            : "Henüz tamamlanan bir görevin yok."}
        </p>
      </section>

      <TaskSection
        title=""
        tasks={completedTasks}
        updatingIds={updatingIds}
        onToggle={toggleCompleted}
        emptyText="Henüz tamamlanan bir görev bulunmuyor."
      />
    </div>
  );
}