import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import { db } from "../../config/firebase";
import { useAuthContext } from "../auth/auth-context";
import { TodoContext } from "./todo-context";
import type { Task, TodoContextType } from "./types";

function toDateMaybe(t?: Timestamp | Date | null): Date | null {
  if (!t) return null;
  // @ts-ignore
  return typeof t.toDate === "function"
    ? (t as Timestamp).toDate()
    : (t as Date);
}
function isSameDay(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isWithinThisWeek(d?: Date | null) {
  if (!d) return false;
  const now = new Date();
  const day = now.getDay(); // 0 Pazar
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return d >= monday && d <= sunday;
}

type Props = { children: ReactNode | ReactElement };

const TodoProvider = ({ children }: Props) => {
  const { user } = useAuthContext();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user?.uid) {
      setAllTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("startAt", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Task[] = snap.docs.map((d) => {
          const raw = d.data() as any;
          return {
            id: d.id,
            title: raw.title ?? "(Başlıksız)",
            chips: Array.isArray(raw.chips) ? raw.chips : [],
            priority: raw.priority ?? undefined,
            completed: !!raw.completed,
            startAt: toDateMaybe(raw.startAt ?? null),
            dueAt: toDateMaybe(raw.dueAt ?? null),
          };
        });
        setAllTasks(data);
        setLoading(false);
      },
      (err) => {
        console.error("tasks snapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const toggleCompleted = useCallback(
    async (taskId: string, value: boolean) => {
      if (!user?.uid) return;

      try {
        setUpdatingIds((m) => ({ ...m, [taskId]: true }));

        setAllTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, completed: value } : t))
        );

        const ref = doc(db, "users", user.uid, "tasks", taskId);
        await updateDoc(ref, { completed: value });
      } catch (e) {
        console.error("toggleCompleted error:", e);

        setAllTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, completed: !value } : t))
        );
        alert("Görev güncellenemedi. Lütfen tekrar deneyin.");
      } finally {
        setUpdatingIds((m) => {
          const { [taskId]: _, ...rest } = m;
          return rest;
        });
      }
    },
    [user?.uid]
  );

  const today = new Date();
  const todayTasks = useMemo(
    () =>
      allTasks.filter(
        (t) => isSameDay(t.startAt, today) || isSameDay(t.dueAt, today)
      ),
    [allTasks]
  );
  const weekTasks = useMemo(
    () =>
      allTasks.filter((t) => isWithinThisWeek(t.startAt ?? t.dueAt ?? null)),
    [allTasks]
  );

  const value: TodoContextType = {
    allTasks,
    todayTasks,
    weekTasks,
    loading,
    updatingIds,
    toggleCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export default TodoProvider;
