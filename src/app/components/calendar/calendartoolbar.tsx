import type { ToolbarProps as RBToolbarProps } from "react-big-calendar";
import type { CalendarEvent } from "../../type";

function Toolbar(props: RBToolbarProps<CalendarEvent, object>) {
  const { onNavigate, onView, label, view } = props;

  const tabBtn =
    "px-3 py-1 rounded-md text-sm font-medium border border-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-[#F6F0D6] hover:bg-white/10 transition";
  const navBtn =
    "inline-flex items-center justify-center rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10";

  return (
    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button
          className={navBtn}
          onClick={() => onNavigate("TODAY")}
          aria-label="Bugün"
        >
          Bugün
        </button>
        <div className="flex items-center gap-1">
          <button
            className={navBtn}
            onClick={() => onNavigate("PREV")}
            aria-label="Önceki"
            title="Önceki"
          >
            ‹
          </button>
          <div className="px-3 text-[#E9DFB3] font-semibold">{label}</div>
          <button
            className={navBtn}
            onClick={() => onNavigate("NEXT")}
            aria-label="Sonraki"
            title="Sonraki"
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          data-active={view === "month"}
          className={tabBtn}
          onClick={() => onView?.("month")}
        >
          Month
        </button>
        <button
          data-active={view === "week"}
          className={tabBtn}
          onClick={() => onView?.("week")}
        >
          Week
        </button>
        <button
          data-active={view === "day"}
          className={tabBtn}
          onClick={() => onView?.("day")}
        >
          Day
        </button>
        <button
          data-active={view === "agenda"}
          className={tabBtn}
          onClick={() => onView?.("agenda")}
        >
          Agenda
        </button>
      </div>
    </div>
  );
}

export default Toolbar;