"use client";

import { createContext, useContext, ReactNode } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthInternalProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const login = async (email: string, name: string) => {
    // NextAuth handle the redirect
    await signIn("credentials", { 
      email, 
      name, 
      password: "password123", // Basic baseline for now
      callbackUrl: "/dashboard" 
    });
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const user = session?.user ? {
    id: session.user.id!,
    name: session.user.name!,
    email: session.user.email!,
    role: (session.user as any).role || "Farmer"
  } : null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthInternalProvider>
        {children}
      </AuthInternalProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
