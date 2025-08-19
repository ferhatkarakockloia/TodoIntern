import { useState, type FormEvent } from "react";
import { useTodoContext } from "../../context/todocontext/todo-context";
import TaskSection from "../../components/tasks/TaskSection";

export default function Today() {
  const { todayTasks, loading, updatingIds, toggleCompleted, addTodo, updateTodo, deleteTodo } =
    useTodoContext();
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newDueTime, setNewDueTime] = useState<string>("");

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTodo(newTaskTitle, newDueTime);
      setNewTaskTitle("");
      setNewDueTime("");
    }
  };

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
        <h1 className="text-4xl font-extrabold text-[#E9DFB3]">Bugün</h1>
        <p className="mt-2 text-[#C8B88A]">
          {todayTasks?.length > 0
            ? "Bugün için görevlerin burada."
            : "Bugün için harika bir başlangıç yap!"}
        </p>
      </section>

      <form onSubmit={handleAddTodo} className="flex flex-wrap gap-2 mb-8">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Yeni görev ekle..."
          className="flex-1 min-w-[150px] bg-transparent border-b-2 border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:border-[#E9DFB3] transition-colors"
        />
        <input
          type="time"
          value={newDueTime}
          onChange={(e) => setNewDueTime(e.target.value)}
          className="time-input-white-icon bg-[#2D2D2D] text-[#F6F0D6] rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E9DFB3] focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#E9DFB3] text-[#191919] font-semibold rounded-lg hover:opacity-80 transition-opacity"
        >
          Ekle
        </button>
      </form>

      <TaskSection
        title=""
        tasks={todayTasks}
        updatingIds={updatingIds}
        onToggle={toggleCompleted}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        emptyText="Bugün için hiç görev yok."
      />
    </div>
  );
}