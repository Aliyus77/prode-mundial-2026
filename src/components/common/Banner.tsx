import React from "react";
import { Box } from "@mui/material";

export const Banner: React.FC = () => {
  return (
    <Box sx={{ width: "100%", height: { xs: 150, sm: 250 }, backgroundColor: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1, my: 2 }}>
      📣 Banner Publicitario
    </Box>
  );
};