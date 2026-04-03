import React from "react";
import { Box } from "@mui/material";
import { useBanner } from "../../hooks/useBanner";

export const Banner: React.FC = () => {
  const { bannerUrl } = useBanner();

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 150, sm: 250 },
        backgroundColor: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 1,
        my: 2,
        backgroundImage: bannerUrl ? `url(${bannerUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!bannerUrl && "📣 Banner Publicitario"}
    </Box>
  );
};