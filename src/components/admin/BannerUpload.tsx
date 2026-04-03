import React from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  Stack,
  Divider,
} from "@mui/material";
import { useBanner } from "../../hooks/useBanner";
import { useNotification } from "../../hooks/useNotification";

export const BannerUpload: React.FC = () => {
  const { bannerUrl, previewUrl, setPreviewUrl, publishBanner } = useBanner();
  const { addNotification } = useNotification();
  const [urlInput, setUrlInput] = React.useState(previewUrl || bannerUrl || "");
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    // Validar si es una URL válida
    try {
      if (url) {
        new URL(url);
        setPreviewUrl(url);
      }
    } catch {
      // No es una URL válida aún
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUrlInput(base64);
      setPreviewUrl(base64);
      addNotification("Imagen cargada correctamente", "success");
      setIsLoading(false);
    };
    reader.onerror = () => {
      addNotification("Error al cargar la imagen", "error");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    if (!urlInput) {
      addNotification("Ingresa una URL o carga una imagen", "warning");
      return;
    }
    try {
      new URL(urlInput);
    } catch {
      // Si no es URL válida, asumir que es base64
      if (!urlInput.startsWith("data:image")) {
        addNotification("URL inválida o imagen no cargada correctamente", "error");
        return;
      }
    }
    publishBanner(urlInput);
    addNotification("✅ Banner publicado correctamente", "success");
  };

  const handleClear = () => {
    setUrlInput("");
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3 }}>
      {/* Formulario */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          📸 Cargar Banner Promocional
        </Typography>

        <Stack spacing={3}>
          {/* Opción 1: URL */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Opción 1: URL de Imagen
            </Typography>
            <TextField
              label="URL de la imagen"
              placeholder="https://example.com/banner.jpg"
              fullWidth
              value={urlInput}
              onChange={handleUrlChange}
              disabled={isLoading}
              helperText="Ingresa la URL completa de la imagen"
              type="url"
            />
          </Box>

          <Divider sx={{ my: 1 }}>O</Divider>

          {/* Opción 2: Cargar archivo */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Opción 2: Cargar Archivo
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isLoading}
              style={{ width: "100%" }}
            />
            {isLoading && <CircularProgress sx={{ mt: 2 }} size={24} />}
          </Box>

          <Alert severity="info">
            💡 Puedes usar URL de internet O cargar un archivo local. La imagen se
            convertirá a base64.
          </Alert>

          {/* Botones de acción */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handlePublish}
              disabled={!urlInput || isLoading}
            >
              📤 Publicar Banner
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClear}
              disabled={!urlInput || isLoading}
            >
              🗑️ Limpiar
            </Button>
          </Stack>

          {bannerUrl && (
            <Alert severity="success">
              ✅ Banner publicado correctamente. Se muestra en todas las páginas.
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Preview */}
      <Paper sx={{ p: 3, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          👁️ Previsualización
        </Typography>

        {previewUrl || bannerUrl ? (
          <Card sx={{ flexGrow: 1 }}>
            <CardMedia
              component="img"
              image={previewUrl || bannerUrl || ""}
              alt="Banner preview"
              sx={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </Card>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "#f5f5f5",
              border: "2px dashed #ccc",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
            }}
          >
            <Typography color="textSecondary" textAlign="center">
              📷 La previsualización aparecerá aquí
            </Typography>
          </Box>
        )}

        {(previewUrl || bannerUrl) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 1 }}>
              {previewUrl === bannerUrl || !previewUrl ? "Banner actual:" : "Vista previa:"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                wordBreak: "break-all",
                color: "#999",
                fontSize: "0.7rem",
              }}
            >
              {(previewUrl || bannerUrl)?.substring(0, 100)}...
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
