import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfile, logoutUser } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("knowmint_user"));
      console.log("AuthContext - User from localStorage:", stored);
      return stored;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log("AuthContext - No user, trying to fetch profile...");
      setLoading(true);
      fetchProfile()
        .then((response) => {
          const profile = response.data?.user;
          console.log("AuthContext - Profile fetched:", profile);
          if (profile) {
            setUser(profile);
            localStorage.setItem("knowmint_user", JSON.stringify(profile));
          }
        })
        .catch((error) => {
          console.log("AuthContext - Failed to fetch profile:", error.message);
          localStorage.removeItem("knowmint_user");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const login = (profile, token) => {
    console.log("AuthContext - Login called with:", { profile, token });
    const userData = { ...profile, token };
    setUser(userData);
    localStorage.setItem("knowmint_user", JSON.stringify(userData));
  };

  const logout = async () => {
    console.log("AuthContext - Logout called");
    try {
      await logoutUser();
      console.log("AuthContext - Backend logout successful");
    } catch (error) {
      console.warn("AuthContext - Backend logout failed:", error.message);
    } finally {
      // Always clear local data regardless of backend success
      setUser(null);
      localStorage.removeItem("knowmint_user");
      console.log("AuthContext - Local data cleared");
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
