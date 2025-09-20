import { useNotifications } from "../../../context/NotificationContext";
import { useEffect } from "react";
import Button from "../Buttons/Button";

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
    <div className="p-4 sm:p-6 max-w-5xl mx-auto transition-colors duration-300 ease-in-out">
      {loading && (
        <p className="text-center text-gray-500 dark:text-neutral-400 animate-pulse transition-colors duration-300 ease-in-out">
          Cargando...
        </p>
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
          <div className="mt-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-neutral-800 p-10 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 transition-colors duration-300 ease-in-out">
            <i className="fa fa-bell text-5xl text-gray-400 dark:text-neutral-400 mb-4 transition-colors duration-300 ease-in-out" />
            <p className="text-gray-600 dark:text-neutral-400 text-lg mb-2 max-w-md transition-colors duration-300 ease-in-out">
              No tienes notificaciones en este momento.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-lg transition-colors duration-300 ease-in-out overflow-hidden">
              <div className="max-h-[550px] overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800 px-4 py-4 space-y-3 transition-colors duration-300 ease-in-out">
                {notifications.map((n) => {
                  return (
                    <div
                      key={n._id}
                      className={`relative p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden ${
                        n.read
                          ? "bg-gray-50 dark:bg-neutral-700"
                          : "bg-white dark:bg-neutral-800"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-1.5 ${
                          n.read
                            ? "bg-gray-300 dark:bg-neutral-500"
                            : "bg-gradient-to-b from-teal-400 to-sky-600"
                        }`}
                      />
                      <div className="flex items-start justify-between gap-3 ml-2">
                        <div className="flex-1">
                          <h2 className="text-base font-semibold mb-1">
                            <span
                              className={`${
                                n.read
                                  ? "text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out"
                                  : "bg-gradient-to-r from-teal-400 to-sky-600 bg-clip-text text-transparent"
                              }`}
                            >
                              {n.title}
                            </span>
                          </h2>
                          <p className="text-xs text-gray-400 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
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
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mt-2 transition-colors duration-300 ease-in-out">
                            {n.message}
                          </p>

                          <div className="mt-3 flex sm:hidden gap-2">
                            {!n.read && (
                              <Button
                                onClick={() => markNotificationAsRead(n._id)}
                                icon="fa-circle-check"
                                type="bg1"
                                full={true}
                              />
                            )}
                            <Button
                              onClick={() => removeNotification(n._id)}
                              icon="fa-trash"
                              type="alert"
                              full={true}
                            />
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 ml-4 self-center">
                          {!n.read && (
                            <Button
                              onClick={() => markNotificationAsRead(n._id)}
                              icon="fa-circle-check"
                              type="bg3"
                              full={false}
                              classes={"rounded-full !px-2 !py-2"}
                            />
                          )}
                          <Button
                            onClick={() => removeNotification(n._id)}
                            icon="fa-trash"
                            type="alert"
                            full={false}
                            classes={"rounded-full !px-2 !py-2"}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {unreadCount > 0 && (
              <div className="flex justify-end mt-6">
                <Button
                  onClick={markAllNotificationsAsRead}
                  icon="fa-envelope-open"
                  label="Marcar todas como leídas"
                  type="bg1"
                  full={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Notification;
