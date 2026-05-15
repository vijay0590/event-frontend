import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== FETCH CURRENT USER PROFILE =====
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // CLEAN FIX: Removed manual Authorization header object.
      // Your global Axios interceptor handles token attachment automatically.
      const res = await API.get("/api/users/me");
      
      const userData = res.data?.user || res.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Auth verification failed:", err);
      // If token is invalid or expired, purge corporate state pointers safely
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial synchronization check on app mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};