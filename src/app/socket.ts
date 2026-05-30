import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) return socket;

  socket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {
    auth: {
      access_token: token,
    },
    autoConnect: true,
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
