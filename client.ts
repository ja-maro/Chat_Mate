import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./server";
import { colours } from "./colours";
import * as readline from "node:readline";
import { argv, stdin as input, stdout as output } from "process";
require("dotenv").config();

// Get port & host argument ; if no port given, defaults to 8080 & localhost
const defaultHost = String(process.env.HOST);
const defaultPort = Number(process.env.PORT);
const rl = readline.createInterface({ input, output });

let host: string = "";
let port: number = 0;
argv.forEach((value, index) => {
  if (value == "-p") {
    port = Number(argv[index + 1]);
  } else if (value == "-h") {
    host = argv[index + 1];
  }
});
host = host !== "" ? host : defaultHost;
port = port > 0 ? port : defaultPort;

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://" + host + ":" + port
);

// Ici, notre chat-basic
function read() {
  rl.question("", (input) => {
    if (input == "exit") {
      console.log("Bye nerdz !");
      rl.close();
      process.exit();
    } else {
      socket.volatile.emit("chat message", input);
      read();
    }
  });
}

read();

socket.on("hello", function (msg) {
  console.log(colours.fg.red, colours.bg.white, msg, colours.reset);
});

socket.on("chat message", (msg) => {
  console.log(colours.fg.yellow, msg, colours.reset);
});
