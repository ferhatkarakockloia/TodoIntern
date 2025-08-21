import type { User } from "firebase/auth";

export type AuthContextType = {
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};