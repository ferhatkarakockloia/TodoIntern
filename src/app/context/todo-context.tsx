import { createContext, useContext } from "react";
import type { TodoContextType } from "./types";

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

export const useChatContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

