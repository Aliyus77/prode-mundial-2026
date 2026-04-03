import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { usePrize } from "../../hooks/usePrize";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";

export const PrizeAssignment: React.FC = () => {
  const { prizes, assignPrize } = usePrize();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedPrize, setSelectedPrize] = React.useState<any>(null);
  const [selectedUser, setSelectedUser] = React.useState<string>("");
  const [users, setUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
    setUsers(mockUsers);
  }, []);

  const handleOpenDialog = (prize: any) => {
    setSelectedPrize(prize);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPrize(null);
    setSelectedUser("");
  };

  const handleAssignPrize = () => {
    if (!selectedPrize || !selectedUser || !user) {
      addNotification("Debes seleccionar un usuario", "error");
      return;
    }

    const selectedUserObj = users.find(u => u.id === selectedUser);
    if (!selectedUserObj) {
      addNotification("Usuario no encontrado", "error");
      return;
    }

    assignPrize({
      prizeId: selectedPrize.id,
      userId: selectedUser,
      userName: selectedUserObj.name,
      criteria: selectedPrize.criteria,
      phase: selectedPrize.phase,
      assignedBy: user.id,
    });

    addNotification(`¡Premio entregado a ${selectedUserObj.name}!`, "success");
    handleCloseDialog();
  };

  if (prizes.length === 0) {
    return <Alert severity="info">No hay premios creados aún. Crea uno primero.</Alert>;
  }

  const criteriaLabel: Record<string, string> = {
    most_points_date: "Más puntos - Fecha",
    most_points_phase: "Más puntos - Fase",
    most_points_tournament: "Más puntos - Torneo",
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
      {prizes.map((prize) => (
        <Card key={prize.id} sx={{ display: "flex", flexDirection: "column" }}>
          {prize.photoUrl && <CardMedia component="img" height="200" image={prize.photoUrl} alt={prize.name} />}
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              🏆 {prize.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {prize.description}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={criteriaLabel[prize.criteria]} size="small" color="primary" variant="outlined" />
              <Chip
                label={prize.assignmentType === "automatic" ? "Automático" : "Manual"}
                size="small"
                variant="outlined"
              />
            </Stack>
            <Typography variant="caption" sx={{ color: "#666" }}>
              Ante empate: {prize.tieResolution === "all" ? "Todos" : prize.tieResolution === "draw" ? "Sorteo" : "Primero"}
            </Typography>
          </CardContent>
          {prize.assignmentType === "manual" && (
            <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={() => handleOpenDialog(prize)}
              >
                Entregar Premio
              </Button>
            </Box>
          )}
        </Card>
      ))}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Entregar Premio: {selectedPrize?.name}</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Seleccionar Usuario</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="Seleccionar Usuario"
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAssignPrize} variant="contained">
            Entregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
