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
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <header className="mb-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <i className="fas fa-bell text-teal-400 text-2xl sm:text-3xl" />
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-500">
            Notificaciones
          </h1>
          {unreadCount > 0 && (
            <div className="w-8 h-8 rounded-full shadow-md flex items-center justify-center animate-pulse bg-rose-500">
              <span className="flex items-center justify-center w-full h-full text-white text-sm font-bold leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </div>
          )}
        </div>
      </header>

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

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center text-center bg-gray-50 p-10 rounded-2xl border border-dashed border-gray-300">
            <i className="fa fa-bell text-5xl text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2 max-w-md">
              No tienes notificaciones en este momento.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
              <div className="max-h-[550px] overflow-y-auto divide-y divide-gray-100 px-4 py-4 space-y-3">
                {notifications.map((n) => {
                  const showBothButtons = !n.read;
                  return (
                    <div
                      key={n._id}
                      className={`relative p-4 rounded-xl transition-all duration-200 ${
                        n.read
                          ? "bg-gray-50 border-l-4 border-gray-200"
                          : "bg-white border-l-4 border-teal-500"
                      } shadow-sm hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h2
                            className={`text-base font-medium mb-1 ${
                              n.read ? "text-gray-500" : "text-teal-600"
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
                          <p className="text-sm text-gray-700 mt-2">
                            {n.message}
                          </p>

                          <div className="mt-3 flex sm:hidden gap-2">
                            {!n.read && (
                              <button
                                onClick={() => markNotificationAsRead(n._id)}
                                className={`cursor-pointer w-full ${
                                  showBothButtons ? "sm:w-1/2" : "sm:w-full"
                                } text-sm text-white bg-teal-500 hover:bg-teal-600 px-3 py-2 rounded-lg shadow transition flex items-center justify-center gap-2`}
                              >
                                <i className="fa-regular fa-circle-check text-base" />
                                Leer
                              </button>
                            )}
                            <button
                              onClick={() => removeNotification(n._id)}
                              className={`cursor-pointer w-full ${
                                showBothButtons ? "sm:w-1/2" : "sm:w-full"
                              } text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg shadow transition flex items-center justify-center gap-2`}
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
                              className="p-2 rounded-full text-teal-500 hover:bg-teal-50 hover:text-teal-600 transition"
                            >
                              <i className="fa-regular fa-circle-check text-base" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(n._id)}
                            title="Eliminar notificación"
                            className="p-2 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition"
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

            {unreadCount > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={markAllNotificationsAsRead}
                  title="Marcar todas como leídas"
                  className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-5 rounded-full shadow-md transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-envelope-open text-lg" />
                  <span className="text-sm font-medium">
                    Marcar todas como leídas
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Notification;
