import { useState, useEffect, type ReactNode, type ReactElement } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";

import { AuthContext } from "./auth-context";
import type { AuthContextType } from "./types";
import { auth } from "../../config/firebase";

type AuthProviderProps = {
  children: ReactNode | ReactElement;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp: AuthContextType["signUp"] = async ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  const value: AuthContextType = {
    user,
    initializing,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
