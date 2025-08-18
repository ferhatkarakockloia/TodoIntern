import { useState } from "react";
import { useAuthContext } from "../../context/auth/auth-context";
import Sidebar from "../../components/sidebar/sidebar.tsx";
import UserMenu from "../../components/usermenu/usermenu.tsx";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { auth } from "../..//config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const { user } = useAuthContext();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Çıkış yapılırken bir hata oluştu:", error);
    }
  };

  return (
    <div className="relative">
      <Sidebar isPanelOpen={isPanelOpen} onPanelClose={closePanel} />

      <main className="min-h-screen bg-[#FFF9F1] text-zinc-900 flex flex-col items-center p-4 pt-8 transition-all duration-300">
        <div className="w-full flex justify-between items-center">
          <button
            onClick={togglePanel}
            className="p-2 rounded-md hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <Bars3Icon className="h-7 w-7 text-zinc-600" />
          </button>
          <UserMenu displayName={user?.displayName || "Kullanıcı"} onLogout={handleLogout} />
        </div>

        {location.pathname === "/home" && (
          <h1 className="text-3xl font-bold mb-6 mt-12">
            Hoş geldin {user?.displayName}
          </h1>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default Home;