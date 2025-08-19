import { CalendarDaysIcon } from "@heroicons/react/24/solid";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <CalendarDaysIcon className="h-7 w-7 text-[#440A0A]" />

      <span className="text-2xl font-extrabold tracking-tight text-[#440A0A]">
        ToDo
      </span>
    </div>
  );
};

export default Logo;
