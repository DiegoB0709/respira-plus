import { useNotifications } from "../context/NotificationContext";
import { useAlerts } from "../context/AlertsContext";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function useUnreadCounts() {
  const { notifications, fetchNotifications } = useNotifications();
  const { alerts, fetchAlertsByDoctor } = useAlerts();
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();

    if (user?.role === "doctor") {
      fetchAlertsByDoctor();
    }
  }, []);

  const unresolvedAlertCount =
    user?.role === "doctor"
      ? alerts.filter((a) => a.status !== "resuelta").length
      : 0;

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const totalNoti = unresolvedAlertCount+unreadNotifCount;

  useEffect(() => {
    document.title = totalNoti > 0 ? `(${totalNoti}) Respira+` : "Respira+";
  }, [totalNoti]);

  return {
    unresolvedAlertCount,
    unreadNotifCount,
  };
}
