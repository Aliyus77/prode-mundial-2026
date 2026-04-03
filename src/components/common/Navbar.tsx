import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCompany } from "../../hooks/useCompany";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();

  const userDisplayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.name || "Usuario";

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          <Typography variant="h6">⚽ PRODE 2026</Typography>
          {company?.name && <Typography variant="body2" sx={{ opacity: 0.9 }}>— {company.name}</Typography>}
        </Box>

        {user ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button color="inherit" component={RouterLink} to="/">Grupos</Button>
              <Button color="inherit" component={RouterLink} to="/podium">Podio</Button>
              {user.role === "admin" && <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>}
            </Box>
            <Box sx={{ borderLeft: "1px solid rgba(255,255,255,0.3)", pl: 2 }}>
              <Typography variant="caption" sx={{ mr: 1 }}>👤 {userDisplayName}</Typography>
              <Button color="inherit" size="small" onClick={() => { logout(); navigate("/login"); }}>Logout</Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/register">Registro</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};