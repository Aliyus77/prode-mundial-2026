import { useContext } from "react";
import { CompanyContext } from "../contexts/CompanyContext";

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error("useCompany debe usarse dentro de CompanyProvider");
  return context;
};
