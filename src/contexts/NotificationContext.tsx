import React, { createContext, useState, useCallback } from "react";
import { NotificationMessage } from "../types";

interface NotificationContextType {
  notifications: NotificationMessage[];
  addNotification: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = useCallback((message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, timestamp: new Date() }]);
    setTimeout(() => removeNotification(id), 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};