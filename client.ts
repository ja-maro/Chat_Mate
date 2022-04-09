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
import { surprise, choc, carré } from "./surprise";
require("dotenv").config();

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

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://" + host + ":" + port
);

// CHAT LOGIC
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
        case "--pass": {
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
        case "--join": {
          let roomName: string = input.split(" ")[1];
          socket.volatile.emit("join_room", roomName);
          break;
        }
        case "--get_users": {
          socket.volatile.emit("get_all_user");
          break;
        }
        case "--get_rooms": {
          socket.volatile.emit("get_rooms");
          break;
        }
        case "--hist": {
          socket.volatile.emit("hist");
          break;
        }
        case "--pm": {
          let dest: string = input.split(" ")[1];
          let tempMsg: string = input.substring(input.indexOf(" ") + 1);
          let message: string = tempMsg.substring(tempMsg.indexOf(" ") + 1);
          socket.volatile.emit("pm", dest, message);
          break;
        }
        case "--surprise": {
          socket.volatile.emit("surprise");
          console.log(surprise)
          break;
        }
        case "--choc": {
          socket.volatile.emit("choc");
          console.log(choc)
          break;
        }
        case "--carré": {
          socket.volatile.emit("carré");
          console.log(carré)
          break;
        }
        default: {
          console.log(colours.fg.red, documentation.error, colours.reset);
          break;
        }
      }
    } else {
      if (input.trim() !== "") {
        socket.volatile.emit("chat message", input);
      }
    }
    read();
  });
}
// WELCOME CONNECTION
socket.on("welcome", (msg) => {
  console.log(colours.fg.green, msg, colours.reset);
  read();
});

// WELCOME AUTH
socket.on("hello", function (msg) {
  console.log(colours.fg.red, colours.bg.white, msg, colours.reset);
});

socket.on("chat message", (msg) => {
  let user_login: string;

  console.log(colours.fg.yellow, msg, colours.reset);
});

//  SYSTEM MESSAGES
socket.on("system message", (msg) => {
  console.log(colours.fg.green, msg, colours.reset);
});
socket.on("smarr", (msg) => {
  console.log(colours.fg.green, msg, colours.reset);
});

// ROOM LIST
socket.on("arr", (msg) => {
  let msgArr: Array<any>;
  let length: number = 0;
  msg.forEach((e: any) => {
    length = length < e.room_name.length ? e.room_name.length : length;
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

// LOGS
socket.on("hist", (msg, room_name) => {
  if (room_name == null) {
    console.log(
      colours.fg.red +
        "Connectez-vous pour accéder à une room et lire son historique" +
        colours.reset
    );
  } else {
    console.log(
      colours.fg.magenta + "HISTORIQUE ROOM : " + room_name + colours.reset
    );

    if (msg[0] == null) {
      console.log(
        colours.fg.red +
          "Oups ! Personne n'a parlé dans cette room ! :'( " +
          colours.reset
      );
    } else {
      let msgArr: Array<any>;
      let length: number = 0;
      msg.forEach((e: any) => {
        length =
          length < e.user_login.length + e.content.length
            ? e.user_login.length + e.content.length
            : length;
      });
      output.write(colours.fg.magenta);
      output.write(" ");
      for (let i = 0; i < length + 7; i++) {
        output.write("_");
      }
      console.log("");
      msg.forEach((e: any) => {
        output.write("|  ");
        output.write(e.user_login);
        output.write(" : ");
        output.write(e.content);
        for (
          let i = 0;
          i < length - (e.user_login.length + e.content.length);
          i++
        ) {
          output.write(" ");
        }
        output.write("  |\n");
      });
      output.write(" ");
      for (let i = 0; i < length + 7; i++) {
        output.write("‾");
      }
      console.log(colours.reset);
    }
  }
});

// PMs
socket.on("pm", (sender, msg) => {
  console.log(
    colours.fg.cyan +
      colours.bright +
      "(PM) " +
      sender +
      " : " +
      colours.reset +
      colours.fg.cyan +
      msg +
      colours.reset
  );
});
