import "./index.css";
import Routers from "./app/routes";
import AuthProvider from "./app/context/auth/auth-provider";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routers />
      </AuthProvider>
    </div>
  );
}

export default App;
