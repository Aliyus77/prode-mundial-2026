import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

// Initialize mock data (only if not already populated)
if (!localStorage.getItem("mockUsers")) {
  const mockUsers = [
    { id: "1", name: "Admin User", firstName: "Admin", lastName: "User", email: "admin@prode.com", dni: "12345678", password: "admin123", role: "admin", createdAt: new Date().toISOString(), hasCompanyCode: true, companyCode: "ADMIN001" },
    { id: "2", name: "Juan García", firstName: "Juan", lastName: "García", email: "juan@example.com", dni: "87654321", password: "pass123", role: "user", createdAt: new Date().toISOString(), hasCompanyCode: false },
    { id: "3", name: "María López", firstName: "María", lastName: "López", email: "maria@example.com", dni: "11223344", password: "pass123", role: "user", createdAt: new Date().toISOString(), hasCompanyCode: true, companyCode: "EMP001" },
    { id: "4", name: "Carlos Rodríguez", firstName: "Carlos", lastName: "Rodríguez", email: "carlos@example.com", dni: "55667788", password: "pass123", role: "user", createdAt: new Date().toISOString(), hasCompanyCode: false },
  ];
  localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)