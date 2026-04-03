import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Alert, Typography } from "@mui/material";
import { loginSchema } from "../../utils/validators";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {}
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField {...register("email")} label="Email" type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message as string} />
      <TextField {...register("password")} label="Contraseña" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message as string} />
      <Box sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
          📝 Credenciales de Demo:
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          <strong>Admin:</strong> admin@prode.com / admin123
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          <strong>Usuario 1:</strong> juan@example.com / pass123
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          <strong>Usuario 2:</strong> maria@example.com / pass123
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          <strong>Usuario 3:</strong> carlos@example.com / pass123
        </Typography>
      </Box>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isLoading}>Login</Button>
    </Box>
  );
};