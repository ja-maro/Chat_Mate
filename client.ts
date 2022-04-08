import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  io as ioc,
} from "./config";
import { colours } from "./colours";
import * as readline from "node:readline";
import { argv, stdin as input, stdout as output } from "process";
import { documentation } from "./documentation";
require("dotenv").config();

// Get port & host argument ; if no port given, defaults to 8080 & localhost
const defaultHost = String(process.env.HOST);
const defaultPort = Number(process.env.PORT);
export const rl = readline.createInterface({ input, output, terminal: false });

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
export function read() {
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
        case "--get_all_user": {
          socket.volatile.emit("get_all_user");
          break;
        }
        case "--get_rooms": {
          socket.volatile.emit("get_rooms");
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
socket.on("welcome", (msg) => {
  console.log(colours.fg.green, msg, colours.reset);
  read();
});

socket.on("hello", function (msg) {
  console.log(colours.fg.red, colours.bg.white, msg, colours.reset);
});

socket.on("chat message", (msg) => {
  let user_login: string;
  // socket.on("user_data", (user) => {
  //   if (user_login != socket.id) {
  console.log(colours.fg.yellow, msg, colours.reset);
  // }
  // });
});

socket.on("system message", (msg) => {
  console.log(colours.fg.green, msg, colours.reset);
});
socket.on("smarr", (msg) => {
  console.log(colours.fg.green, msg, colours.reset);
});

socket.on("arr", (msg) => {
  let msgArr: Array<any>;
  let length: number = 0;
  msg.forEach((e: any) => {
    length = length < e.room_name.length ? e.room_name.length : length;
    // console.log(colours.fg.green, e.room_name, colours.reset);
  });
  output.write(" ");
  for (let i = 0; i < length + 4; i++) {
    output.write("_");
  }
  console.log("");
  msg.forEach((e: any) => {
    output.write("|  ");
    output.write(e.room_name);

    for (let i = 0; i < length - e.room_name.length; i++) {
      output.write(" ");
    }
    output.write("  |\n");
  });
  output.write(" ");
  for (let i = 0; i < length + 4; i++) {
    output.write("‾");
  }
  console.log("");
});
