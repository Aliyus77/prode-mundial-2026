import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

// Initialize mock data
const mockUsers = [
  { 
    id: "1", 
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    email: "admin@prode.com", 
    dni: "12345678", 
    password: "admin123", 
    role: "admin", 
    createdAt: new Date(), 
    hasCompanyCode: true, 
    companyCode: "ADMIN001" 
  },
  { 
    id: "2", 
    name: "Juan Garcia",
    firstName: "Juan",
    lastName: "García",
    email: "juan@example.com", 
    dni: "87654321", 
    password: "pass123", 
    role: "user", 
    createdAt: new Date(), 
    hasCompanyCode: false 
  },
  { 
    id: "3", 
    name: "Maria Lopez",
    firstName: "María",
    lastName: "López",
    email: "maria@example.com", 
    dni: "11223344", 
    password: "pass123", 
    role: "user", 
    createdAt: new Date(), 
    hasCompanyCode: true,
    companyCode: "COMP001"
  },
  { 
    id: "4", 
    name: "Carlos Rodriguez",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos@example.com", 
    dni: "55667788", 
    password: "pass123", 
    role: "user", 
    createdAt: new Date(), 
    hasCompanyCode: false 
  },
];

const mockPrizes = [
  {
    id: "1",
    name: "Copa del Mejor Predictor",
    description: "El usuario con más puntos en todo el torneo se lleva esta coveted cup",
    photoUrl: undefined,
    criteria: "most_points_tournament",
    assignmentType: "automatic",
    tieResolution: "all",
    createdAt: new Date(),
    createdBy: "1"
  },
  {
    id: "2",
    name: "Estrella de la Fase",
    description: "Mejor predictor en la fase de grupos",
    photoUrl: undefined,
    criteria: "most_points_phase",
    assignmentType: "automatic",
    tieResolution: "draw",
    phase: "groups",
    createdAt: new Date(),
    createdBy: "1"
  }
];

// Default banner
const defaultBanner = "https://via.placeholder.com/1200x250?text=MUNDIAL+2026";

// Default company config
const mockCompanyConfig = {
  id: "default",
  name: "Mi Empresa PRODE",
  updatedAt: new Date(),
  updatedBy: "1"
};

localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
localStorage.setItem("mockPrizes", JSON.stringify(mockPrizes));
localStorage.setItem("mockAssignments", JSON.stringify([]));
localStorage.setItem("mockBanner", defaultBanner);
localStorage.setItem("mockCompanyConfig", JSON.stringify(mockCompanyConfig));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)