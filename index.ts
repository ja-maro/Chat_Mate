import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./server";
import { colours } from "./colours";

import { argv } from "process";
require("dotenv").config();

// Get port & host argument ; if no port given, defaults to 8080 & localhost
const defaultHost = String(process.env.HOST);
const defaultPort = Number(process.env.PORT);

let host: string = "";
let port: number = 0;
argv.forEach((value, index) => {
  if (value == "-p") {
    port = Number(argv[index + 1]);
  } else if (value == "-h") {
    host = argv[index + 1];
  }
});
host = (host !== "" ? host : defaultHost)
port = (port > 0 ? port: defaultPort);

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://" + host + ":" + port
);
const plop = "plop";
socket.emit("hello", plop);

socket.on("msgEmit", (msg) => {
  console.log(colours.fg.red, colours.bg.white, msg , colours.reset);
});


// socket.on("noArg", () => {
//     // ...
//   });

//   socket.on("basicEmit", (a, b, c) => {
//     // a is inferred as number, b as string and c as buffer
//   });

//   socket.on("withAck", (d, callback) => {
//     // d is inferred as string and callback as a function that takes a number as argument
//   });
