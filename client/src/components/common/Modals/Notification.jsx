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
      <h1 className="text-2xl font-bold text-center text-teal-500 mb-6 flex items-center justify-center gap-2">
        <i className="fas fa-bell text-teal-400 text-xl" />
        Notificaciones
        {unreadCount > 0 && (
          <span className="ml-2 text-xs font-semibold text-white bg-red-600 rounded-full px-2 py-0.5 shadow-md">
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

      <div className="border border-gray-200 rounded-xl shadow-sm bg-white">
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 px-2 py-2 space-y-2">
          {notifications.map((n) => {
            const showBothButtons = !n.read;
            return (
              <div
                key={n._id}
                className={`relative p-3 rounded-md transition-all ${
                  n.read
                    ? "bg-gray-50 border-l-4 border-gray-200"
                    : "bg-white border-l-4 border-teal-500"
                } shadow-sm hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2
                      className={`text-sm font-semibold mb-0.5 ${
                        n.read ? "text-gray-500" : "text-teal-500"
                      }`}
                    >
                      {n.title}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{n.message}</p>

                    <div className="mt-3 flex sm:hidden gap-2">
                      {!n.read && (
                        <button
                          onClick={() => markNotificationAsRead(n._id)}
                          className={`w-full ${
                            showBothButtons ? "sm:w-1/2" : "sm:w-full"
                          } text-sm text-white bg-teal-500 hover:bg-teal-400 px-3 py-2 rounded-md transition flex items-center justify-center gap-2`}
                        >
                          <i className="fa-regular fa-circle-check text-base" />
                          Leer
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(n._id)}
                        className={`w-full ${
                          showBothButtons ? "sm:w-1/2" : "sm:w-full"
                        } text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition flex items-center justify-center gap-2`}
                      >
                        <i className="fa-solid fa-trash text-base" />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 ml-4 self-center">
                    {!n.read && (
                      <button
                        onClick={() => markNotificationAsRead(n._id)}
                        title="Marcar como leída"
                        className="cursor-pointer text-teal-500 hover:bg-teal-50 hover:text-teal-400 px-2 py-2 rounded-full transition"
                      >
                        <i className="fa-regular fa-circle-check text-base" />
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(n._id)}
                      title="Eliminar notificación"
                      className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-800 px-2 py-2 rounded-full transition"
                    >
                      <i className="fa-solid fa-trash text-base" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {notifications.length > 0 && unreadCount > 0 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={markAllNotificationsAsRead}
            title="Marcar todas como leídas"
            className="cursor-pointer text-teal-500 hover:text-white hover:bg-teal-400  py-2 px-4 rounded-full transition duration-500 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-envelope-open text-lg" />
            <span className="text-sm font-medium">
              Marcar todas como leídas
            </span>
          </button>
        </div>
      )}
    </>
  );
}

export default Notification;
