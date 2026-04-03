import React from "react";
import { Container, Tabs, Tab, Box, Typography } from "@mui/material";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { PrizeForm } from "../components/admin/PrizeForm";
import { PrizeAssignment } from "../components/admin/PrizeAssignment";
import { PrizeHistory } from "../components/admin/PrizeHistory";
import { BannerUpload } from "../components/admin/BannerUpload";
import { CompanyConfigComponent } from "../components/admin/CompanyConfig";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <ProtectedRoute adminOnly>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          👨‍💼 Panel de Administración
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3, overflowX: "auto" }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="🏆 Crear Premios" />
            <Tab label="🎁 Entregar Premios" />
            <Tab label="📋 Historial" />
            <Tab label="📸 Banner" />
            <Tab label="⚙️ Configuración" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <PrizeForm onPrizeCreated={() => setTabValue(1)} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PrizeAssignment />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <PrizeHistory />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <BannerUpload />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <CompanyConfigComponent />
        </TabPanel>
      </Container>
    </ProtectedRoute>
  );
};