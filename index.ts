import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./server";
// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:8080"
);
const plop = "plop";
socket.emit("hello", plop);

// socket.on("Miaou", () => {
//     console.log("I'm a cat");
//   });

// socket.on("noArg", () => {
//     // ...
//   });

//   socket.on("basicEmit", (a, b, c) => {
//     // a is inferred as number, b as string and c as buffer
//   });

//   socket.on("withAck", (d, callback) => {
//     // d is inferred as string and callback as a function that takes a number as argument
//   });

