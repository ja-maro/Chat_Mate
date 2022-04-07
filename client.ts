import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./config";
import { colours } from "./colours";
import * as readline from "node:readline";
import { argv, stdin as input, stdout as output } from "process";
import { documentation } from "./documentation";
require("dotenv").config();

// Get port & host argument ; if no port given, defaults to 8080 & localhost
const defaultHost = String(process.env.HOST);
const defaultPort = Number(process.env.PORT);
//const rl = readline.createInterface({ input, output });


//full readline for inputs
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});


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
    if (input[0] && input[1] === "-") {
      switch (input.split(" ")[0]) {
        case "--exit": {
          console.log("Bye nerdz !");
          rl.close();
          process.exit();
        }
        case "--help": {
          console.log(
            colours.fg.green,
            documentation.intro,
            documentation.cmds,
            colours.reset
          );
          break;
        }
        case "--login": {
          let login: string = input.split(" ")[1];
          socket.volatile.emit("login", login);
          break;
        }
        case "--pwd": {
          let pwd: string = input.split(" ")[1];
          socket.volatile.emit("pwd", pwd);
          break;
        }
        case "--register": {
          let userInfos: string[] = input.split(" ").splice(1, 2);
          socket.volatile.emit("register", userInfos);
          break;
        }
        case "--create_room": {
          let roomName: string = input.split(" ")[1];
          socket.volatile.emit("create_room", roomName);
          break;
        }
        default: {
          console.log(colours.fg.green, documentation.error, colours.reset);
          break;
        }
      }
    } else {
      socket.volatile.emit("chat message", input);
    }
    read();
  });
}

read();

socket.on("hello", function (msg) {
  console.log(colours.fg.red, colours.bg.white, msg, colours.reset);
});

socket.on("chat message", (msg) => {
  console.log(colours.fg.yellow, msg, colours.reset);
});

socket.on("system message", (msg) => {
  console.log(colours.fg.green, msg, colours.reset);
});
