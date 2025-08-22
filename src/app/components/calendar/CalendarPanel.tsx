import Calendar from "react-calendar";

export default function CalendarPanel() {
  return (
    <div className="sticky top-6 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <Calendar
        locale="tr-TR"
        next2Label="»"
        prev2Label="«"
        nextLabel="›"
        prevLabel="‹"
        className="w-full rounded-xl overflow-hidden !bg-transparent
          [&_.react-calendar__tile]:!bg-transparent
          [&_.react-calendar__tile]:!text-[#F6F0D6]
          [&_.react-calendar__navigation_button]:!bg-transparent
          [&_.react-calendar__navigation_button]:!text-[#E9DFB3]
          [&_.react-calendar__navigation_button]:hover:!bg-white/10
          [&_.react-calendar__month-view__days__day--weekend]:!text-[#FF6B6B]"
        tileClassName={({ date }) =>
          new Date().toDateString() === date.toDateString()
            ? "!bg-[#E9DFB3] !text-[#2B1C14] rounded-md"
            : undefined
        }
      />
    </div>
  );
}
