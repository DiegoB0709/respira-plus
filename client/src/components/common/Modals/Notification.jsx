import { useNotifications } from "../../../context/NotificationContext";
import { useEffect } from "react";

function Notification() {
  const {
    notifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    loading,
    error,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Notificaciones{" "}
        {unreadCount > 0 && (
          <span className="text-sm font-normal text-white bg-red-500 rounded-full px-2 py-0.5 ml-2">
            {unreadCount}
          </span>
        )}
      </h1>

      {loading && (
        <p className="text-center text-gray-500 animate-pulse">Cargando...</p>
      )}

      {error.length > 0 && (
        <ul className="text-red-600 text-sm mb-4 list-disc list-inside">
          {error.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <div className="border-2 border-gray-200 rounded-xl p-0 pr-0.5">
        <div className="max-h-96 overflow-y-auto space-y-2 px-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`my-4 relative rounded-lg p-3 shadow-sm border-l-4 ${
                n.read ? "border-gray-300 bg-white" : "border-teal-500 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-base font-medium ${
                    n.read ? "text-gray-400" : "text-teal-600"
                  }`}
                >
                  {n.title}
                  <span className="text-xs text-gray-500 ml-2">
                    (
                    {new Date(n.createdAt).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </span>
                </h2>
              </div>

              <p className="text-sm text-gray-700 mt-0.5">{n.message}</p>
              <div className="mt-2 flex items-center gap-3">
                {!n.read && (
                  <button
                    onClick={() => markNotificationAsRead(n._id)}
                    className="text-xs text-teal-600 hover:text-indigo-800 transition"
                  >
                    <i className="fa-regular fa-circle-check mr-1"></i>
                    Marcar como leída
                  </button>
                )}
                <button
                  onClick={() => removeNotification(n._id)}
                  className="text-xs text-red-600 hover:text-red-800 transition"
                >
                  <i className="fa-solid fa-trash mr-1"></i>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {notifications.length > 0 && unreadCount > 0 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={markAllNotificationsAsRead}
            className="text-sm font-bold text-teal-600 hover:text-teal-800 transition"
          >
            <i className="fa-solid fa-envelope-open mr-1"></i>
            Marcar todas como leídas
          </button>
        </div>
      )}
    </>
  );
}

export default Notification;
