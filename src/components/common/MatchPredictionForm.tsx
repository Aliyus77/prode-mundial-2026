import React from "react";
import { Box, TextField, Typography, Chip, Button, Alert } from "@mui/material";
import { Match } from "../../types";
import { usePrediction } from "../../hooks/usePrediction";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import { formatDate } from "../../utils/dateHelpers";

interface MatchPredictionFormProps {
  match: Match;
}

export const MatchPredictionForm: React.FC<MatchPredictionFormProps> = ({ match }) => {
  const { getPrediction, savePrediction, isPredictionLocked, canPredict } = usePrediction();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [homeScore, setHomeScore] = React.useState("");
  const [awayScore, setAwayScore] = React.useState("");

  const prediction = user ? getPrediction(match.id, user.id) : null;
  const isLocked = user ? isPredictionLocked(match.scheduledDate, match.id, user.id) : false;
  const canMakePrediction = user && !isLocked && canPredict(match.scheduledDate);

  const hoursUntil = (new Date(match.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60);

  const handleSavePrediction = () => {
    if (!user) {
      addNotification("Debes estar logueado para hacer predicciones", "error");
      return;
    }

    if (!homeScore || !awayScore) {
      addNotification("Completa ambos campos de puntuación", "warning");
      return;
    }

    const home = parseInt(homeScore);
    const away = parseInt(awayScore);

    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      addNotification("Ingresa números válidos (0 o mayor)", "error");
      return;
    }

    savePrediction(match.id, home, away, user.id);
    addNotification("✅ Predicción guardada correctamente", "success");
    setHomeScore("");
    setAwayScore("");
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid #eee",
        borderRadius: 1,
        backgroundColor: isLocked && prediction ? "#f5f5f5" : "#fff",
      }}
    >
      {/* Fecha y estado */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#666" }}>
          📅 {formatDate(new Date(match.scheduledDate))}
        </Typography>
        <Box>
          {prediction && <Chip label="✅ Predicción guardada" color="success" size="small" />}
          {isLocked && !prediction && <Chip label="⏰ Límite pasado" color="error" size="small" />}
          {hoursUntil <= 24 && !prediction && (
            <Chip
              label={`⚠️ ${Math.round(hoursUntil)} horas restantes`}
              color="warning"
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* Si ya tiene predicción, mostrar lo guardado */}
      {prediction && (
        <Box sx={{ backgroundColor: "#e8f5e9", p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            Tu predicción:
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">{match.homeTeamFlag} {match.homeTeam}</Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              {prediction.homeScore} - {prediction.awayScore}
            </Typography>
            <Typography variant="h6">{match.awayTeam} {match.awayTeamFlag}</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#666", display: "block", mt: 1 }}>
            Cargada hace:{" "}
            {Math.round((Date.now() - prediction.loadedAt) / 60000)} minutos
          </Typography>
        </Box>
      )}

      {/* Inputs para hacer predicción */}
      {!prediction && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ textAlign: "right", flex: 1 }}>
              <Typography sx={{ mb: 1 }}>
                {match.homeTeamFlag} {match.homeTeam}
              </Typography>
              <TextField
                type="number"
                inputProps={{ min: 0, disabled: isLocked }}
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                disabled={isLocked}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              -
            </Typography>

            <Box sx={{ textAlign: "left", flex: 1 }}>
              <Typography sx={{ mb: 1 }}>
                {match.awayTeam} {match.awayTeamFlag}
              </Typography>
              <TextField
                type="number"
                inputProps={{ min: 0, disabled: isLocked }}
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                disabled={isLocked}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>
          </Box>

          {isLocked ? (
            <Alert severity="error">
              ⏰ No se puede predecir después de 24 horas del partido
            </Alert>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleSavePrediction}
              disabled={!homeScore || !awayScore}
            >
              Guardar Predicción
            </Button>
          )}
        </>
      )}

      {match.isFinished && (
        <Box sx={{ mt: 2, p: 1, backgroundColor: "#fff3e0", borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            Resultado oficial: {match.homeScore} - {match.awayScore}
          </Typography>
          {prediction && (
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              {prediction.homeScore === match.homeScore &&
              prediction.awayScore === match.awayScore
                ? "✅ ¡Acertaste el resultado exacto! (+3 pts)"
                : prediction.homeScore > prediction.awayScore &&
                    match.homeScore! > match.awayScore!
                  ? "✅ Acertaste el ganador (+1 pt)"
                  : "❌ No acertaste"}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
