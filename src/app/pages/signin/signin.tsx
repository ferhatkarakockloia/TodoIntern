import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth/auth-context";
import bg2 from "../../../assets/bg4.png";

const SignIn = () => {
  const nav = useNavigate();
  const { signIn } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signIn(email, password);
      nav("/home");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("Giriş başarısız.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#E6E2B0]">
        <img
          src={bg2}
          alt="Login Background"
          className="w-full h-full object-contain scale-75"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-[#E6E2B0] p-4 sm:p-6 md:p-8">
        <section className="w-full max-w-md rounded-2xl bg-[#FFFCDE] p-6 shadow-xl ring-1 ring-black/5">
          <h1 className="text-2xl font-bold text-[#440A0A]">Login</h1>
          <p className="mt-1 text-sm text-zinc-700">
            Sign in with your email and password.
          </p>

          {err && (
            <div className="mt-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm text-[#440A0A]">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#440A0A]/30 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#440A0A]"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm text-[#440A0A]">Password</span>
              <div className="mt-1 relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#440A0A]/30 px-3 py-2 bg-white pr-24 focus:outline-none focus:ring-2 focus:ring-[#440A0A]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#440A0A] hover:opacity-80"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#440A0A] py-2.5 text-[#FFFCDE] font-semibold hover:brightness-110 disabled:opacity-60 shadow-md"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-sm text-zinc-700">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#440A0A] font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignIn;