import { useMemo, useState } from "react";
import { useAuthContext } from "../../context/auth/auth-context";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { app } from "../../config/firebase";

const db = getFirestore(app);

function nowLocalInputValue(offsetMinutes = 0) {
  const d = new Date(Date.now() + offsetMinutes * 60_000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function toTimestampOrNull(v: string) {
  if (!v) return null;
  const date = new Date(v);
  return isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
}

const AddTask = () => {
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const defaultStart = useMemo(() => nowLocalInputValue(), []);
  const defaultDue = useMemo(() => nowLocalInputValue(60), []);
  const [startAt, setStartAt] = useState(defaultStart);
  const [dueAt, setDueAt] = useState(defaultDue);

  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);
    if (!user) {
      setErr("Oturum bulunamadı. Lütfen giriş yapın.");
      return;
    }

    if (!title.trim()) {
      setErr("Başlık zorunludur.");
      return;
    }
    const tsStart = toTimestampOrNull(startAt);
    const tsDue = toTimestampOrNull(dueAt);

    if (!tsDue) {
      setErr("Bitiş tarihi ve saati (Due) geçerli olmalıdır.");
      return;
    }
    if (tsStart && tsDue && tsStart.toMillis() > tsDue.toMillis()) {
      setErr("Bitiş tarihi başlangıçtan sonra olmalıdır.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        title: title.trim(),
        description: description.trim() || "",
        startAt: tsStart,
        dueAt: tsDue,
        priority,
        completed: false,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // reset
      setTitle("");
      setDescription("");
      setStartAt(nowLocalInputValue());
      setDueAt(nowLocalInputValue(60));
      setPriority("medium");
      setOk("Görev eklendi!");
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Görev eklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-2 text-[#E9DFB3]">
        Yeni Görev Ekle
      </h2>
      <p className="text-sm text-[#C8B88A] mb-6">
        Başlık, tarih-saat ve öncelik seçip kaydedin.
      </p>

      {err && (
        <div className="mb-4 w-full max-w-md rounded-lg border border-red-400 bg-red-500/10 px-4 py-2 text-red-200">
          {err}
        </div>
      )}
      {ok && (
        <div className="mb-4 w-full max-w-md rounded-lg border border-emerald-400 bg-emerald-500/10 px-4 py-2 text-emerald-200">
          {ok}
        </div>
      )}

      <form onSubmit={handleAddTask} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Görev Başlığı *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-white/5 text-[#F6F0D6] placeholder:text-[#b7ab82] p-2 rounded"
          required
        />

        <textarea
          placeholder="Açıklama (opsiyonel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-white/10 bg-white/5 text-[#F6F0D6] placeholder:text-[#b7ab82] p-2 rounded"
          rows={4}
        />

        <label className="block text-sm text-[#E9DFB3]">
          Başlangıç Tarihi ve Saati (opsiyonel)
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="mt-1 w-full border border-white/10 bg-white/5 text-[#F6F0D6] p-2 rounded"
          />
        </label>

        <label className="block text-sm text-[#E9DFB3]">
          Bitiş Tarihi ve Saati (Due) *
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="mt-1 w-full border border-white/10 bg-white/5 text-[#F6F0D6] p-2 rounded"
            required
          />
        </label>

        <label className="block text-sm text-[#E9DFB3]">
          Öncelik
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="mt-1 w-full border border-white/10 bg-white/5 text-[#F6F0D6] p-2 rounded"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#E9DFB3] text-[#2B1C14] px-4 py-2 rounded font-semibold w-full"
        >
          {loading ? "Ekleniyor…" : "Görev Ekle"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
