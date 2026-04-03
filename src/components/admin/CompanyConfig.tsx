import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Card, CardHeader, CardContent, Alert, Typography } from "@mui/material";
import { useCompany } from "../../hooks/useCompany";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import { CompanyConfig } from "../../types";

export const CompanyConfigComponent: React.FC = () => {
  const { company, updateCompany } = useCompany();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    if (company?.name) {
      setCompanyName(company.name);
    }
  }, [company]);

  const handleSave = () => {
    if (!companyName.trim()) {
      addNotification("El nombre de la empresa no puede estar vacío", "error");
      return;
    }

    if (!user) {
      addNotification("Debes estar logueado", "error");
      return;
    }

    const config: CompanyConfig = {
      id: company?.id || "default",
      name: companyName.trim(),
      updatedAt: new Date(),
      updatedBy: user.id,
    };

    updateCompany(config);
    addNotification("✅ Configuración de empresa actualizada", "success");
  };

  return (
    <Card>
      <CardHeader title="⚙️ Configuración de Empresa" />
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Configura el nombre de tu empresa que aparecerá en la barra de navegación junto a "⚽ PRODE 2026"
        </Alert>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre de la Empresa"
            placeholder="Ej: Acme Corporation"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            fullWidth
            variant="outlined"
          />

          {company?.name && (
            <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: "#666" }}>
                Configuración actual:
              </Typography>
              <Typography variant="h6">⚽ PRODE 2026 — {company.name}</Typography>
              <Typography variant="caption" sx={{ color: "#999", display: "block", mt: 1 }}>
                Última actualización: {new Date(company.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar Configuración
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
