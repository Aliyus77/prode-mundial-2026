import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
    success: { main: "#4caf50" },
    error: { main: "#f44336" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});