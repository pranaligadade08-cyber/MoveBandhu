import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("movebandhu_token") || localStorage.getItem("movemate_token"));
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.auth.me();
        setUser(res.user);
      } catch (err) {
        console.warn("Session expired or invalid token:", err);
        localStorage.removeItem("movebandhu_token");
        localStorage.removeItem("movemate_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);
  const login = async (email, pass) => {
    const res = await api.auth.login(email, pass);
    localStorage.setItem("movebandhu_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };
  const register = async (data) => {
    const res = await api.auth.register(data);
    localStorage.setItem("movebandhu_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };
  const logout = () => {
    localStorage.removeItem("movebandhu_token");
    localStorage.removeItem("movemate_token");
    setToken(null);
    setUser(null);
  };
  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.auth.me();
      setUser(res.user);
    } catch {
      logout();
    }
  };
  return <AuthContext.Provider
    value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser
    }}
  >
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
