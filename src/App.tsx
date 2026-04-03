import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PrizeProvider } from "./contexts/PrizeContext";
import { BannerProvider } from "./contexts/BannerContext";
import { PredictionProvider } from "./contexts/PredictionContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import { Navbar } from "./components/common/Navbar";
import { NotificationSnackbar } from "./components/common/NotificationSnackbar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { GroupsPage } from "./pages/GroupsPage";
import { PodiumPage } from "./pages/PodiumPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CompanyProvider>
          <PrizeProvider>
            <BannerProvider>
              <PredictionProvider>
                <NotificationProvider>
                  <BrowserRouter>
                    <Navbar />
                    <NotificationSnackbar />
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
                      <Route path="/podium" element={<ProtectedRoute><PodiumPage /></ProtectedRoute>} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </BrowserRouter>
                </NotificationProvider>
              </PredictionProvider>
            </BannerProvider>
          </PrizeProvider>
        </CompanyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;