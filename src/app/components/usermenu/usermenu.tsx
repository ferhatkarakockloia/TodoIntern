
import { useState } from "react";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";

interface UserMenuProps {
  displayName: string;
  onLogout: () => void;
}

const UserMenu = ({ displayName, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center w-full rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <UserCircleIcon className="h-8 w-8 text-zinc-500 mr-2" />
          {displayName}
          <ChevronDownIcon
            className={`h-5 w-5 ml-2 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={onLogout}
              className="text-zinc-700 block w-full text-left px-4 py-2 text-sm hover:bg-zinc-100"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;