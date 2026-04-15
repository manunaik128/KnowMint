import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfile, logoutUser } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("knowmint_user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(true);
      fetchProfile()
        .then((response) => {
          const profile = response.data?.user;
          if (profile) {
            setUser(profile);
            localStorage.setItem("knowmint_user", JSON.stringify(profile));
          }
        })
        .catch(() => {
          localStorage.removeItem("knowmint_user");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const login = (profile) => {
    setUser(profile);
    localStorage.setItem("knowmint_user", JSON.stringify(profile));
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn("Logout failed", error);
    }

    setUser(null);
    localStorage.removeItem("knowmint_user");
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
