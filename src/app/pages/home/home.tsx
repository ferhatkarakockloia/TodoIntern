import { useState } from "react";
import { useAuthContext } from "../../context/auth/auth-context";
import Sidebar from "../../components/sidebar/sidebar.tsx";
import UserMenu from "../../components/usermenu/usermenu.tsx";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { auth } from "../..//config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Outlet } from "react-router-dom";

const Home = () => {
  const { user } = useAuthContext();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  const togglePanel = () => setIsPanelOpen((p) => !p);
  const closePanel = () => setIsPanelOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Çıkış yapılırken bir hata oluştu:", error);
    }
  };

  return (
    <div className="relative">
      <Sidebar isPanelOpen={isPanelOpen} onPanelClose={closePanel} />

      <main className="min-h-screen bg-[#2B1C14] text-[#F6F0D6] flex flex-col items-center p-4 pt-8 transition-all duration-300">
        <div className="w-full max-w-6xl flex justify-between items-center">
          <button
            onClick={togglePanel}
            className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <Bars3Icon className="h-7 w-7 text-[#E9DFB3]" />
          </button>

          <UserMenu
            displayName={user?.displayName || "Kullanıcı"}
            onLogout={handleLogout}
          />
        </div>

        <div className="w-full max-w-6xl mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Home;
