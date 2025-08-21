import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  type DocumentData,
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
  // @ts-expect-error Firebase Timestamp type is not assignable to Date type.
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
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - diffToMonday);
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
          const raw = d.data() as DocumentData;
          return {
            id: d.id,
            title: raw.title ?? "(Başlıksız)",
            description:
              typeof raw.description === "string" ? raw.description : "",
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
      (err: unknown) => {
        console.error("tasks snapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const toggleCompleted = useCallback<TodoContextType["toggleCompleted"]>(
    async (taskId, value) => {
      if (!user?.uid) return;
      try {
        setUpdatingIds((m) => ({ ...m, [taskId]: true }));
        setAllTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, completed: value } : t))
        );
        const ref = doc(db, "users", user.uid, "tasks", taskId);
        await updateDoc(ref, { completed: value, updatedAt: Timestamp.now() });
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

  const addTodo = useCallback<TodoContextType["addTodo"]>(
    async (input) => {
      if (!user?.uid) return;

      const payload = {
        title: input.title.trim(),
        description: input.description?.trim() || "",
        startAt: input.startAt ?? null,
        dueAt: input.dueAt,
        priority: input.priority ?? "medium",
        chips: Array.isArray(input.chips) ? input.chips : [],
        completed: false,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      try {
        await addDoc(collection(db, "users", user.uid, "tasks"), payload);
      } catch (e) {
        console.error("addTodo error:", e);

        alert("Görev eklenemedi. Lütfen tekrar deneyin.");
      }
    },
    [user?.uid]
  );

  const updateTodo = useCallback<TodoContextType["updateTodo"]>(
    async (taskId, data) => {
      if (!user?.uid) return;
      const docRef = doc(db, "users", user.uid, "tasks", taskId);
      try {
        await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
      } catch (e) {
        console.error("updateTodo error:", e);
        alert("Görev güncellenemedi. Lütfen tekrar deneyin.");
      }
    },
    [user?.uid]
  );

  const deleteTodo = useCallback<TodoContextType["deleteTodo"]>(
    /* aynı */ async (taskId) => {
      if (!user?.uid) return;
      try {
        await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
      } catch (e) {
        console.error("deleteTodo error:", e);
        alert("Görev silinemedi. Lütfen tekrar deneyin.");
      }
    },
    [user?.uid]
  );

  const todayTasks = useMemo(() => {
    const today = new Date();
    return allTasks.filter((t) => isSameDay(t.dueAt, today));
  }, [allTasks]);

  const weekTasks = useMemo(
    () =>
      allTasks.filter((t) => isWithinThisWeek(t.startAt ?? t.dueAt ?? null)),
    [allTasks]
  );

  // Bu kısım eklendi
  const pastTasks = useMemo(() => {
    const now = new Date();
    return allTasks.filter(task => {
      const dueDate = toDateMaybe(task.dueAt);
      return dueDate && dueDate < now;
    });
  }, [allTasks]);

  // Bu kısım güncellendi
  const value: TodoContextType = {
    allTasks,
    todayTasks,
    weekTasks,
    pastTasks, 
    loading,
    updatingIds,
    toggleCompleted,
    addTodo,
    updateTodo,
    deleteTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export default TodoProvider;