import { useContext } from "react";
import { PrizeContext } from "../contexts/PrizeContext";

export const usePrize = () => {
  const context = useContext(PrizeContext);
  if (!context) throw new Error("usePrize debe usarse dentro de PrizeProvider");
  return context;
};
