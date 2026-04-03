import React from "react";
import { Container, Paper, Box, Typography } from "@mui/material";
import { RegisterForm } from "../components/auth/RegisterForm";
import { Link as RouterLink } from "react-router-dom";

export const RegisterPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>Registro</Typography>
      <RegisterForm />
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">Ya tienes cuenta? <RouterLink to="/login" style={{ color: "#1976d2" }}>Inicia sesion</RouterLink></Typography>
      </Box>
    </Paper>
  </Container>
);