import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Alert,
} from "@mui/material";
import { usePrize } from "../../hooks/usePrize";
import { formatDate } from "../../utils/dateHelpers";

export const PrizeHistory: React.FC = () => {
  const { prizes, assignments } = usePrize();

  if (assignments.length === 0) {
    return <Alert severity="info">No hay premios entregados aún.</Alert>;
  }

  const criteriaLabel: Record<string, string> = {
    most_points_date: "Más puntos - Fecha",
    most_points_phase: "Más puntos - Fase",
    most_points_tournament: "Más puntos - Torneo",
  };

  const getPrizeName = (prizeId: string) => {
    return prizes.find(p => p.id === prizeId)?.name || "Desconocido";
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        📋 Historial de Premios Entregados
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Premio</strong></TableCell>
              <TableCell><strong>Usuario</strong></TableCell>
              <TableCell><strong>Criterio</strong></TableCell>
              <TableCell><strong>Fase</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{formatDate(new Date(assignment.assignmentDate))}</TableCell>
                <TableCell>
                  <strong>🏆 {getPrizeName(assignment.prizeId)}</strong>
                </TableCell>
                <TableCell>{assignment.userName}</TableCell>
                <TableCell>
                  <Chip
                    label={criteriaLabel[assignment.criteria] || assignment.criteria}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{assignment.phase || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" sx={{ display: "block", mt: 2, color: "#666" }}>
        Total de premios entregados: {assignments.length}
      </Typography>
    </Box>
  );
};
