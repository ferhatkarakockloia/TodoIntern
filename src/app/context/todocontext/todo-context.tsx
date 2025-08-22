import { createContext, useContext } from "react";
import type { TodoContextType } from "./types";

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

export const useTodoContext = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return ctx;
};
