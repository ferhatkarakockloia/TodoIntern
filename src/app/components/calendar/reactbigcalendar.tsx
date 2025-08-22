import { Calendar as RBCalendar, dateFnsLocalizer, type View, type SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { tr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { CalendarEvent } from "../../type";
import Toolbar from "./calendartoolbar.tsx";

const locales = { tr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarViewProps {
  events: CalendarEvent[];
  date: Date;
  view: View;
  onView: (view: View) => void;
  onNavigate: (date: Date) => void;
  onSelectSlot: (slot: SlotInfo) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  eventPropGetter: (event: CalendarEvent) => { className: string };
}

const CalendarView = ({
  events,
  date,
  view,
  onView,
  onNavigate,
  onSelectSlot,
  onSelectEvent,
  eventPropGetter,
}: CalendarViewProps) => {
  return (
    <RBCalendar
      localizer={localizer}
      events={events}
      date={date}
      view={view}
      onView={onView}
      onNavigate={onNavigate}
      views={["month", "week", "day", "agenda"]}
      popup
      selectable
      startAccessor="start"
      endAccessor="end"
      style={{ height: "calc(100vh - 180px)" }}
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      eventPropGetter={eventPropGetter}
      components={{ toolbar: Toolbar }}
      messages={{
        week: "Hafta",
        work_week: "İş Haftası",
        day: "Gün",
        month: "Ay",
        previous: "Önceki",
        next: "Sonraki",
        today: "Bugün",
        agenda: "Ajanda",
        date: "Tarih",
        time: "Saat",
        event: "Etkinlik",
        noEventsInRange: "Bu aralıkta etkinlik yok",
        showMore: (total) => `+${total} daha`,
      }}
    />
  );
};

export default CalendarView;