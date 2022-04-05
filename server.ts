import { argv } from 'node:process';

// Get port argument ; if no port given, defaults to 8080
let port: number = 0;
argv.forEach((value, index) => {
  if (value == "-p") {
    port = Number(argv[index + 1]);
  }
});
port = (port > 0 ? port: 8080)

// I declare my types :
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  log: (msg: string) => String;
}

export interface ClientToServerEvents {
  hello: (arg: string) => any;
  // Miaou: () => void;
}

// interface InterServerEvents {
//   ping: () => void;
// }

interface SocketData {
  name: string;
  age: number;
}

import { Server } from "socket.io";

// I create my server
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  // InterServerEvents,
  SocketData
>(port);

// Pour de futurs fonctionalitées plus compliqués
// io.on("connection", (socket) => {
// socket.emit("noArg");
// socket.emit("basicEmit", 1, "2", Buffer.from([3]));
// socket.emit("withAck", "4", (e) => {
// e is inferred as number
// });
// socket.emit("log", "msg");
// works when broadcast to all
// io.emit("noArg");

// works when broadcasting to a room
// io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
// });

// The ones declared in the ClientToServerEvents interface are used when receiving events:
io.on("connection", (socket) => {
  socket.on("hello", (arg) => {
    console.log("hello comrade " + arg);
  });
  // socket.emit("Miaou");
});

// The ones declared in the InterServerEvents interface are used for inter-server communication (added in socket.io@4.1.0):
// io.serverSideEmit("ping");

// io.on("ping", () => {
//   // ...
// });

// And finally, the SocketData type is used to type the socket.data attribute (added in socket.io@4.4.0):
// io.on("connection", (socket) => {
//   socket.data.name = "john";
//   socket.data.age = 42;
// });
