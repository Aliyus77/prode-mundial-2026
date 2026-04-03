import { useContext } from "react";
import { BannerContext } from "../contexts/BannerContext";

export const useBanner = () => {
  const context = useContext(BannerContext);
  if (!context) throw new Error("useBanner debe usarse dentro de BannerProvider");
  return context;
};
