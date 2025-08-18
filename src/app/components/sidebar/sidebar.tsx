import {
  PlusCircleIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import type { SidebarProps } from "../../type";

const Sidebar = ({ isPanelOpen, onPanelClose }: SidebarProps) => {
  const sidebarClasses = isPanelOpen
    ? "transform translate-x-0"
    : "transform -translate-x-full";

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${sidebarClasses}`}
    >
      <div className="p-4 pt-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={onPanelClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6">Menü</h2>
        <ul className="space-y-2">
          {/* Görev Ekle Linki */}
          <li>
            <a
              href="#"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <PlusCircleIcon className="h-6 w-6 text-zinc-500" />
              <span>Görev Ekle</span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <CalendarIcon className="h-6 w-6 text-zinc-500" />
              <span>Bugün</span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ClockIcon className="h-6 w-6 text-zinc-500" />
              <span>Yaklaşan</span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <CalendarDaysIcon className="h-6 w-6 text-zinc-500" />
              <span>Takvim</span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <CheckCircleIcon className="h-6 w-6 text-zinc-500" />
              <span>Tamamlanan</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
