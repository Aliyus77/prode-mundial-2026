import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Alert } from "@mui/material";
import { registerSchema } from "../../utils/validators";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });
  const { register: registerUser, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      navigate("/");
    } catch (err) {}
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField {...register("name")} label="Nombre" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message as string} />
      <TextField {...register("email")} label="Email" type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message as string} />
      <TextField {...register("dni")} label="DNI" fullWidth margin="normal" error={!!errors.dni} helperText={errors.dni?.message as string} />
      <TextField {...register("password")} label="Contraseña" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message as string} />
      <TextField {...register("companyCode")} label="Codigo Empresa (Opcional)" fullWidth margin="normal" />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isLoading}>Registrarse</Button>
    </Box>
  );
};