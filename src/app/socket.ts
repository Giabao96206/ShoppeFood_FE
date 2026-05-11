import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) return socket;

  socket = io("http://192.168.0.43:5000", {
    auth: {
      access_token: token,
    },
    autoConnect: true,
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
