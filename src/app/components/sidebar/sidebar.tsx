import {
  PlusCircleIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  HomeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import type { SidebarProps } from "../../type";

const Sidebar = ({ isPanelOpen, onPanelClose }: SidebarProps) => {
  const sidebarClasses = isPanelOpen
    ? "transform translate-x-0"
    : "transform -translate-x-full";

  const getNavLinkClasses = ({ isActive }: { isActive: boolean }) => {
    const baseClasses = "flex items-center space-x-3 p-2 rounded-lg transition-colors";
    const activeClasses = isActive ? "bg-zinc-100" : "hover:bg-zinc-100";
    return `${baseClasses} ${activeClasses}`;
  };

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

        <h2 className="text-xl font-bold mb-6">TodoApp</h2>
        
        <NavLink 
          to="/home" 
          onClick={onPanelClose}
          className={getNavLinkClasses}
          end
        >
          <HomeIcon className="h-6 w-6 text-zinc-500" />
          <span className="text-lg font-semibold text-zinc-800">Merhaba!</span>
        </NavLink>
        
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/home/add-task"
              onClick={onPanelClose}
              className={getNavLinkClasses}
            >
              <PlusCircleIcon className="h-6 w-6 text-zinc-500" />
              <span>Görev Ekle</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/home/today"
              onClick={onPanelClose}
              className={getNavLinkClasses}
              end
            >
              <CalendarIcon className="h-6 w-6 text-zinc-500" />
              <span>Bugün</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/home/upcoming"
              onClick={onPanelClose}
              className={getNavLinkClasses}
            >
              <ClockIcon className="h-6 w-6 text-zinc-500" />
              <span>Yaklaşan</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/home/calendar"
              onClick={onPanelClose}
              className={getNavLinkClasses}
            >
              <CalendarDaysIcon className="h-6 w-6 text-zinc-500" />
              <span>Takvim</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/home/completed"
              onClick={onPanelClose}
              className={getNavLinkClasses}
            >
              <CheckCircleIcon className="h-6 w-6 text-zinc-500" />
              <span>Tamamlanan</span>
            </NavLink>
          </li>
          
          {/* Buraya yeni Geçmiş Görevler linki eklendi */}
          <li>
            <NavLink
              to="/home/history"
              onClick={onPanelClose}
              className={getNavLinkClasses}
            >
              <ClockIcon className="h-6 w-6 text-zinc-500" /> {/* Veya başka bir ikon */}
              <span>Geçmiş Görevler</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/home/settings"
              onClick={onPanelClose}
              className={getNavLinkClasses}
            >
              <Cog6ToothIcon className="h-6 w-6 text-zinc-500" />
              <span>Ayarlar</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;