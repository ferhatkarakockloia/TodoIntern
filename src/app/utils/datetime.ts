export function fmtDT(d?: Date | null) {
  if (!d) return null;
  const date = d.toLocaleDateString("tr-TR");
  const time = d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
}
