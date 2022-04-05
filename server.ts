import { argv } from "node:process";
require("dotenv").config();
import { Server } from "socket.io";

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
  hello: (msg: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: (arg: string) => any;
  "chat message": (msg: string) => void;
}

interface SocketData {
  name: string;
  age: number;
}

// I create my server
const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  port
);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("reçu: " + msg);
    socket.broadcast.emit("chat message", msg);
  });

  socket.emit("hello", "===START_CHATING===");
});
