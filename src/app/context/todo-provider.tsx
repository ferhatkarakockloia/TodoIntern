import { useState, type ReactNode, type ReactElement } from 'react';
import { TodoContext } from './todo-context';

type TodoProviderProps = {
  children: ReactNode | ReactElement;
};

const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todos, setTodos] = useState<string[]>([]);

  return (
    <TodoContext.Provider value={{ todos
        
     }}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;    