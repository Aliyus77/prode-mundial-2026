import React, { createContext, useState, useCallback, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const users = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) throw new Error("Credenciales inválidas");
      setUser(user);
      setToken("mock-token-" + user.id);
      localStorage.setItem("token", "mock-token-" + user.id);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const users = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      if (users.find((u: any) => u.email === userData.email)) {
        throw new Error("Email ya registrado");
      }
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: "user",
        createdAt: new Date(),
        hasCompanyCode: !!userData.companyCode,
      };
      users.push(newUser);
      localStorage.setItem("mockUsers", JSON.stringify(users));
      setUser(newUser);
      setToken("mock-token-" + newUser.id);
      localStorage.setItem("token", "mock-token-" + newUser.id);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};