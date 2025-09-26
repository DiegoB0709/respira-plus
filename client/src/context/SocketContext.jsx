import { createContext, useContext, useEffect, useState } from "react";
import { socketManager } from "../lib/socket";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";
import Toast from "../components/common/Toast/Toast";

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = Cookies.get("token");
    if (!token) return;

    socketManager.disconnect();
    const s = socketManager.connect(token);
    if (!s) return;

    setSocket(s);

    s.onAny((event, data) => {
      console.log("Evento recibido:", event, data);
    });

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleNotification = (data) =>
      addToast("notification", data.title || "Nueva notificación");
    const handleAlert = (data) =>
      addToast("alert", data.message || "Nueva alerta");

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);
    s.on("server:notification", handleNotification);
    s.on("server:alert", handleAlert);

    return () => {
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
      s.off("server:notification", handleNotification);
      s.off("server:alert", handleAlert);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      socketManager.disconnect();
      setSocket(null);
      setIsConnected(false);
      setToasts([]);
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, addToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            fixed={false}
          />
        ))}
      </div>
    </SocketContext.Provider>
  );
};
