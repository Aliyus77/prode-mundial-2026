import { useContext } from "react";
import { PredictionContext } from "../contexts/PredictionContext";

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) throw new Error("usePrediction debe usarse dentro de PredictionProvider");
  return context;
};
