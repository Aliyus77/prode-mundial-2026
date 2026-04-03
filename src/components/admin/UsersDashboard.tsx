import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const stored = localStorage.getItem("mockUsers");
    if (stored) setUsers(JSON.parse(stored));
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.dni?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchCompany =
      filterCompany === "all" ||
      (filterCompany === "yes" && u.hasCompanyCode) ||
      (filterCompany === "no" && !u.hasCompanyCode);
    return matchSearch && matchCompany;
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        👥 Usuarios Registrados
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Buscar por nombre, DNI o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 280 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Código empresa</InputLabel>
          <Select
            value={filterCompany}
            label="Código empresa"
            onChange={(e) => setFilterCompany(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="yes">Con código</MenuItem>
            <MenuItem value="no">Sin código</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>DNI</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Rol</strong></TableCell>
              <TableCell><strong>Empresa</strong></TableCell>
              <TableCell><strong>Registrado</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.name || `${u.firstName} ${u.lastName}`}</TableCell>
                <TableCell>{u.dni || "-"}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip
                    label={u.role === "admin" ? "Admin" : "Usuario"}
                    color={u.role === "admin" ? "secondary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {u.hasCompanyCode ? (
                    <Chip label={u.companyCode || "Sí"} color="success" size="small" />
                  ) : (
                    <Chip label="No" variant="outlined" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No se encontraron usuarios</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value))}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas:"
      />
    </Box>
  );
};
