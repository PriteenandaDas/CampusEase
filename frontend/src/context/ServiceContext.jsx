import { createContext, useState, useEffect } from "react";

export const ServiceContext = createContext();

export const ServiceContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [serviceData, setServiceData] = useState([]); // ✅ empty array (NOT null)
  const [loading, setLoading] = useState(true); // ✅ loading state

  const fetchServices = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/service/get`);
      const data = await res.json();

      if (data.success) {
        setServiceData(data.services);
      }
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider value={{ serviceData, loading }}>
      {children}
    </ServiceContext.Provider>
  );
};
