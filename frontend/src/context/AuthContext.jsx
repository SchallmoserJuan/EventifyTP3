import { createContext, useContext, useEffect, useState } from "react";
import { authApi, setAuthToken } from "@/lib/api";

const AuthContext = createContext();

const TOKEN_KEY = "eventify_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    setAuthToken(stored);
    authApi
      .me()
      .then((profile) => {
        setUser(profile);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { token, user } = await authApi.login(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const { token, user } = await authApi.register(payload);
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  return ctx;
}
