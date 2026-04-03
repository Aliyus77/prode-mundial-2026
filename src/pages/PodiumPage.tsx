import React from "react";
import { Container, Box, Card, CardContent, Typography } from "@mui/material";

export const PodiumPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>🏆 Ranking</Typography>
    <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
      <Card sx={{ flex: 1, minWidth: 150, textAlign: "center", backgroundColor: "#fff9c4" }}>
        <CardContent>
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🥇</Typography>
          <Typography>1 lugar</Typography>
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>100 pts</Typography>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, minWidth: 150, textAlign: "center", backgroundColor: "#e8e8e8" }}>
        <CardContent>
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🥈</Typography>
          <Typography>2 lugar</Typography>
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>80 pts</Typography>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, minWidth: 150, textAlign: "center", backgroundColor: "#ffcc80" }}>
        <CardContent>
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🥉</Typography>
          <Typography>3 lugar</Typography>
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>60 pts</Typography>
        </CardContent>
      </Card>
    </Box>
  </Container>
);