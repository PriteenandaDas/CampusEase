import React, { createContext, useState, useEffect } from "react";

// Create context
export const AppContext = createContext({
  backendUrl: "",
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userData: null,
  setUserData: () => {},
  fetchProfile: async () => {},
  logout: async () => {},
});

// Provider component
export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch profile using cookie
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        method: "GET",
        credentials: "include", //send cookies
      });
      const data = await res.json();
      if (data.success) {
        setUserData(data.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (err) {
      console.error("Profile fetch failed", err);
      setIsLoggedIn(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${backendUrl}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setUserData(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Auto-check profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    fetchProfile,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
