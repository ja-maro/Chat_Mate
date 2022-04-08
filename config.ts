import { Server } from "socket.io";
import { argv } from "node:process";

// Get port argument ; if no port given, defaults to 8080
const defaultPort = Number(process.env.PORT);
let port: number = 0;
argv.forEach((value, index) => {
  if (value == "-p") {
    port = Number(argv[index + 1]);
  }
});
port = port > 0 ? port : defaultPort;

// I declare my types :
export interface ServerToClientEvents {
  noArg: () => void;
  "chat message": (msg: string) => void;
  "system message": (msg: string) => void;
  hello: (msg: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  close_login: () => void;
  welcome: (msg: string) => void;
  user_data: (data: string) => void;
}

export interface ClientToServerEvents {
  hello: (arg: string) => any;
  "chat message": (msg: string) => void;
  login: (username: string, password: string) => void;
  pwd: (msg: string) => void;
  register: (msg: string[]) => void;
  create_room: (msg: string) => void;
  addfriend: (friend_login: string) => void;
  friendlist: (friendlist: string) => void;
  removefriend: (friend_login: string) => void;
}

export interface SocketData {
  id: number;
  login: string;
  password: string;
  room_id: number;
  room_name: string;
}

// I create my server
export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>(port);
