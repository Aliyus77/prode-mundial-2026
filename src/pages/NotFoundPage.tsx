import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h1" sx={{ mb: 2 }}>404</Typography>
      <Typography variant="h4" sx={{ mb: 4 }}>Pagina no encontrada</Typography>
      <Button variant="contained" onClick={() => navigate("/")}>Volver</Button>
    </Container>
  );
};