import React from "react";
import { Container, Box, Grid, Card, CardHeader, CardContent, Typography, Chip, Alert } from "@mui/material";
import { useMatches } from "../hooks/useMatches";
import { Banner } from "../components/common/Banner";
import { MatchPredictionForm } from "../components/common/MatchPredictionForm";

export const GroupsPage: React.FC = () => {
  const { matches } = useMatches();
  const grouped = matches.reduce((acc, m) => {
    if (!acc[m.group]) acc[m.group] = [];
    acc[m.group].push(m);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Banner />
      <Alert severity="info" sx={{ mb: 3 }}>
        ⚽ Haz tus predicciones para cada partido. Tienes 24 horas antes del inicio para cambiar
        tu predicción.
      </Alert>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>⚽ Fase de Grupos</Typography>
      <Grid container spacing={3}>
        {Object.entries(grouped).map(([group, groupMatches]) => (
          <Grid item xs={12} md={6} key={group}>
            <Card>
              <CardHeader title={"Grupo " + group} />
              <CardContent>
                {groupMatches.map((m) => (
                  <MatchPredictionForm key={m.id} match={m} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};