import "./index.css";
import Routers from "./app/routes";
import AuthProvider from "./app/context/auth/auth-provider";
import TodoProvider from "./app/context/todocontext/todo-provider";

function App() {
  return (
    <div>
      <AuthProvider>
        <TodoProvider>
          <Routers />
        </TodoProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
