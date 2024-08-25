import { UserType } from "./types";
import { WebSocket } from "ws";

export class User {
  public id: string;
  public name: string;
  public socket: WebSocket;

  constructor({ name, socket, id }: UserType) {
    this.name = name;
    this.socket = socket;
    this.id = id;
  }
}
