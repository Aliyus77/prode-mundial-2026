import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNotification } from "../../hooks/useNotification";

export const NotificationSnackbar: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notif) => (
        <Snackbar key={notif.id} open={true} onClose={() => removeNotification(notif.id)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={() => removeNotification(notif.id)} severity={notif.type}>{notif.message}</Alert>
        </Snackbar>
      ))}
    </>
  );
};