import { io } from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) return this.socket;
    if (!token) return null;

    this.socket = io("http://localhost:4000", {
      withCredentials: true,
      autoConnect: true,
      auth: { token },
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("[Socket] Conectado");
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      console.log("[Socket] Desconectado");
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const socketManager = new SocketManager();
