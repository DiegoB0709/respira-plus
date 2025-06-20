import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../api/notification";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState([]); // Inicializado como array para el hook
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  useAutoClearErrors(error, setError);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await getUserNotifications();
      setNotifications(data);
    } catch (err) {
      handleApiError(
        err,
        "Ocurrió un error al cargar las notificaciones.",
        setError
      );
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const { data } = await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      return data;
    } catch (err) {
      handleApiError(
        err,
        "No se pudo marcar la notificación como leída.",
        setError
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      handleApiError(
        err,
        "No se pudieron marcar todas las notificaciones como leídas.",
        setError
      );
    }
  };

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      handleApiError(err, "No se pudo eliminar la notificación.", setError);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
