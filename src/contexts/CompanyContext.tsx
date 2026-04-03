import React, { createContext, useState, useCallback, useEffect } from "react";
import { CompanyConfig } from "../types";

interface CompanyContextType {
  company: CompanyConfig | null;
  updateCompany: (config: CompanyConfig) => void;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<CompanyConfig | null>(null);

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mockCompanyConfig");
    if (saved) {
      setCompany(JSON.parse(saved));
    }
  }, []);

  const updateCompany = useCallback((config: CompanyConfig) => {
    setCompany(config);
    localStorage.setItem("mockCompanyConfig", JSON.stringify(config));
  }, []);

  return (
    <CompanyContext.Provider value={{ company, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
