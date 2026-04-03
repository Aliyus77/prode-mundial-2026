import React from "react";
import { Container, Box, Card, CardContent, Typography, Stack } from "@mui/material";
import { UserPrizes } from "../components/common/UserPrizes";

// Mock data for podium
const podiumData = [
  { position: 1, name: "Juan Garcia", points: 145, medal: "🥇" },
  { position: 2, name: "Maria Lopez", points: 128, medal: "🥈" },
  { position: 3, name: "Carlos Rodriguez", points: 112, medal: "🥉" },
];

export const PodiumPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
      🏆 Ranking del Torneo
    </Typography>

    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3, mb: 4 }}>
      {podiumData.map((user, idx) => (
        <Card
          key={user.position}
          sx={{
            textAlign: "center",
            backgroundColor:
              user.position === 1 ? "#fff9c4" : user.position === 2 ? "#e8e8e8" : "#ffcc80",
            transform: user.position === 1 ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.3s",
          }}
        >
          <CardContent>
            <Typography variant="h2" sx={{ mb: 1 }}>
              {user.medal}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Posición {user.position}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user.name}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              {user.points} pts
            </Typography>
            <UserPrizes userId={`${user.position}`} userName={user.name} />
          </CardContent>
        </Card>
      ))}
    </Box>

    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📊 Clasificación General
        </Typography>
        <Stack spacing={2}>
          {[...Array(5)].map((_, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-between", pb: 1, borderBottom: "1px solid #eee" }}>
              <Typography>{i + 4}. Usuario {i + 4}</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{100 - i * 10} pts</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  </Container>
);