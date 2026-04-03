import React from "react";
import { Container, Paper, Box, Typography } from "@mui/material";
import { LoginForm } from "../components/auth/LoginForm";
import { Link as RouterLink } from "react-router-dom";

export const LoginPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>⚽ PRODE 2026</Typography>
      <LoginForm />
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">No tienes cuenta? <RouterLink to="/register" style={{ color: "#1976d2" }}>Registrate</RouterLink></Typography>
      </Box>
    </Paper>
  </Container>
);