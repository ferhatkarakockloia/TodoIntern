import { useState } from "react";
import { useTodoContext } from "../../context/todocontext/todo-context";
import TaskSection from "../../components/tasks/TaskSection";
import AddTask from "../addTask/addTask";
export default function Today() {
  const {
    todayTasks,
    loading,
    updatingIds,
    toggleCompleted,
    updateTodo,
    deleteTodo,
  } = useTodoContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-8 px-3 py-2 bg-[#E9DFB3] text-[#191919] font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-opacity"
      >
        Yeni Görev Ekle
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-lg p-6 bg-[#2D2D2D] rounded-xl shadow-2xl border border-white/10">
            {/* Modal kapatma butonu */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#C8B88A] hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <AddTask isTodayPage={true} />
          </div>
        </div>
      )}
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
