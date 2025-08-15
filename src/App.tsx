import './App.css'
import TodoProvider from './app/context/todo-provider'
import Routers from './app/routes'

function App() {

  return (
    <div>
      <TodoProvider>
        <Routers />
      </TodoProvider>
    </div>
  )
}

export default App
