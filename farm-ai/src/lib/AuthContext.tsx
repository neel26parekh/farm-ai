"use client";

import { useState, createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for persistent mock session
    const storedUser = localStorage.getItem("farmai_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Protected route logic
  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname.startsWith("/dashboard")) {
        router.push("/auth/login");
      }
      if (user && pathname.startsWith("/auth")) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (email: string, name: string) => {
    const newUser = { id: Math.random().toString(36).substring(7), name, email, role: "Progressive Farmer" };
    setUser(newUser);
    localStorage.setItem("farmai_user", JSON.stringify(newUser));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("farmai_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
