import { WebSocket } from "ws";

export type UserType = {
  id: string;
  name: string;
  socket: WebSocket;
};
