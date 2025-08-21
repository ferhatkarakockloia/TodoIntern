import { useTodoContext } from '../../context/todocontext/todo-context';
import type { Task } from '../../context/todocontext/types';
import TaskCard from '../../components/tasks/TaskCard';

function HistoryPage() {
  const { pastTasks } = useTodoContext();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#F6F0D6] mb-6">Geçmiş Görevler</h1>
      
      {pastTasks.length === 0 ? (
        <p className="text-zinc-400">Henüz tamamlanmış veya günü geçmiş görev yok.</p>
      ) : (
        // Bu kısım güncellendi: Alt alta dizilmesi için div yapısı kullanıldı
        <div className="space-y-4">
          {pastTasks.map((task: Task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggle={async () => {}} 
              onUpdate={async () => {}}
              onDelete={async () => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;