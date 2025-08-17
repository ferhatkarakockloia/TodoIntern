import { useAuthContext } from "../../context/auth/auth-context";

const Home = () => {
  const { user } = useAuthContext();

  return (
    <main className="min-h-screen bg-[#FFF9F1] text-zinc-900 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">
        Hoş geldin {user?.displayName}
      </h1>
    </main>
  );
};
export default Home;
