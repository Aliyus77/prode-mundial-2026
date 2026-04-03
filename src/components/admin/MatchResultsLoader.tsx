import React, { useState } from "react";
import { Box, Card, CardHeader, CardContent, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useMatches } from "../../hooks/useMatches";
import { useNotification } from "../../hooks/useNotification";

export const MatchResultsLoader: React.FC = () => {
  const { matches, updateMatchResult } = useMatches();
  const { addNotification } = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  const pendingMatches = matches.filter(m => !m.isFinished);

  const handleOpenDialog = (match: any) => {
    setSelectedMatch(match);
    setHomeScore(match.homeScore?.toString() || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMatch(null);
    setHomeScore("");
  };

  const handleSaveResult = () => {
    if (!selectedMatch) return;

    const home = parseInt(homeScore);
    if (isNaN(home) || home < 0) {
      addNotification("Ingresa números válidos", "error");
      return;
    }

    updateMatchResult(selectedMatch.id, home, parseInt(awayScore || "0"));
    addNotification(`✅ Resultado guardado: ${selectedMatch.homeTeam} ${home} - ${parseInt(awayScore || "0")} ${selectedMatch.awayTeam}`, "success");
    handleCloseDialog();
  };

  return (
    <Card>
      <CardHeader title="📊 Cargar Resultados de Partidos" />
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Carga los resultados de los partidos completados. Solo se puede cargar una vez por partido.
        </Alert>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Partido</strong></TableCell>
                <TableCell><strong>Resultado</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acción</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{new Date(match.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell>{match.homeTeam} vs {match.awayTeam}</TableCell>
                  <TableCell>
                    {match.isFinished 
                      ? `${match.homeScore} - ${match.awayScore}` 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {match.isFinished ? "✅ Completado" : "⏳ Pendiente"}
                  </TableCell>
                  <TableCell align="center">
                    {!match.isFinished && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleOpenDialog(match)}
                      >
                        Cargar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, p: 1, backgroundColor: "#f0f0f0", borderRadius: 1 }}>
          Partidos pendientes: <strong>{pendingMatches.length}</strong> de {matches.length}
        </Box>

        {/* Dialog para cargar resultado */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Cargar resultado: {selectedMatch?.homeTeam} vs {selectedMatch?.awayTeam}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                label={`${selectedMatch?.homeTeam} (goles)`}
                type="number"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                inputProps={{ min: 0 }}
                fullWidth
              />
              <Box sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>-</Box>
              <TextField
                label={`${selectedMatch?.awayTeam} (goles)`}
                type="number"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSaveResult} variant="contained">
              Guardar Resultado
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
