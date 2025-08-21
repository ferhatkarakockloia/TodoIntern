import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  BellAlertIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import Logo from "../../components/logo";

function HeaderNav() {
  return (
    <header className="mx-auto max-w-6xl flex items-center justify-between px-6 py-6 text-[#440A0A] font-bold">
      <Logo />

      <nav className="flex items-center gap-6 text-[15px]">
        <div className="relative group inline-block">
          <Link to="/signin" className="hover:opacity-100">
            Login
          </Link>
          <span
            className="absolute left-0 -bottom-1 h-[3px] w-0 bg-[#440A0A] transition-all duration-500 group-hover:w-full"
            aria-hidden="true"
          />
        </div>

        <div className="relative group inline-block">
          <Link to="/signup">Sign Up</Link>
          <span
            className="absolute left-0 -bottom-1 h-[3px] w-0 bg-[#440A0A] transition-all duration-500 group-hover:w-full"
            aria-hidden="true"
          />
        </div>
      </nav>
    </header>
  );
}

function HeroLeft() {
  const navigate = useNavigate();
  return (
    <section>
      <h1 className="text-[44px] leading-[1.05] font-black md:text-6xl">
        Plan your <br /> tasks with{" "}
        <span className="bg-[#440A0A] text-[#FFFCDE] px-2 rounded">ease</span>
      </h1>
      <p className="mt-5 text-zinc-600 text-lg max-w-xl">
        Manage your to-do list in a simple and effective way.
      </p>
      <button
        onClick={() => navigate("/signin")}
        className="relative group mt-8 inline-flex items-center rounded-2xl px-6 py-3 font-semibold border-2 border-[#440A0A] text-[#440A0A] overflow-hidden shadow-[0_8px_24px_rgba(68,10,10,0.35)] transition"
      >
        <span className="absolute left-0 bottom-0 h-full w-0 bg-[#440A0A] transition-all duration-500 group-hover:w-full z-0" />

        <span className="relative z-10 group-hover:text-[#FFFCDE]">
          Get Started
        </span>
      </button>
    </section>
  );
}

function PreviewCard() {
  return (
    <div className="absolute inset-0 rounded-[18px] bg-[#FFFCDE] shadow-xl ring-1 ring-black/5 overflow-hidden">
      <div className="h-12 bg-[#440A0A]" />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 flex items-center justify-center rounded-md border-2 border-[#440A0A] bg-[#FFFCDE]">
            <CalendarDaysIcon className="h-5 w-5 text-[#440A0A]" />
          </div>
          <div className="h-3 w-56 rounded-full bg-zinc-200" />
        </div>
        <div className="flex items-center gap-4">
          <CheckCircleIcon className="h-6 w-6 text-[#440A0A]" />
          <div className="h-3 w-64 rounded-full bg-zinc-200" />
        </div>
        <div className="flex items-center gap-4 opacity-80">
          <div className="h-6 w-6 rounded-full border border-[#440A0A] bg-[#FFFCDE]" />
          <div className="h-3 w-52 rounded-full bg-zinc-200" />
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
          <div className="h-full w-[80%] bg-[#440A0A]" />
        </div>
      </div>
    </div>
  );
}

function Bell({ ring }: { ring: boolean }) {
  return (
    <div
      className="absolute -right-3 -top-3 h-11 w-11 rounded-full bg-[#FFFCDE] shadow-lg ring-1 ring-black/5 grid place-items-center"
      aria-label="Notification bell"
    >
      <BellAlertIcon
        className={`h-6 w-6 text-[#440A0A] ${
          ring ? "animate-bellRingOnce" : ""
        }`}
      />
    </div>
  );
}

const Landing = () => {
  const [bellHit, setBellHit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBellHit(true);
      setTimeout(() => setBellHit(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#E6E2B0] text-zinc-900">
      <HeaderNav />

      <main className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center px-6 py-10 md:py-16">
        <HeroLeft />
        <aside className="justify-self-center md:justify-self-end">
          <div className="relative w-[460px] max-w-full h-[320px]">
            <PreviewCard />
            <Bell ring={bellHit} />
          </div>
        </aside>
      </main>

      <style>{`
        @keyframes bellRingOnce {
          0% { transform: rotate(0deg); }
          12% { transform: rotate(14deg); }
          24% { transform: rotate(-12deg); }
          36% { transform: rotate(10deg); }
          48% { transform: rotate(-8deg); }
          66% { transform: rotate(6deg); }
          82% { transform: rotate(-4deg); }
          94% { transform: rotate(2deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-bellRingOnce {
          animation: bellRingOnce 760ms ease-in-out 1;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};

export default Landing;
