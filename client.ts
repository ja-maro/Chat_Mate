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

//to hide password while typing it, we would have to change the way we ask for it, we should
//have a rl.question() for password, so the response would have a "hideEchoBack: true", which hides it
// i still don't know how to integrate this here !!!
//

//hide pasword -- dont forget npm install readline-sync
var readlineSync = require("readline-sync");
// ask for username and wait for user's response.

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
          var login = readlineSync.question("login: ", {});
          var passWord = readlineSync.question("password: ", {
            hideEchoBack: true, // `*` (default).
          });
          socket.volatile.emit("login", login.split(" ")[0], passWord);
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

        //ajouter un user dans sa friendlist
        //il faut corriger le query sql
        case "--addfriend" : {
          let user_login: string = input.split(" ")[0];
          let friend_login: string = input.split(" ")[1];
          socket.volatile.emit("addfriend",friend_login);
          break;
        }
        //afficher la liste des amies par à port son login --friendlist <login>
        //authentication est requis pour vérifier si c'est bien le meme login que celui qui la demande
        //il faut corriger le query sql
        case "--friendlist": {
          let friendlist: string = input.split(" ")[1];
          socket.volatile.emit("friendlist", friendlist);
          break;         
        }
        //remove a friend from your friend list: 
        //il faut corriger le query sql
        case "--removefriend": {
          let friendlist: string = input.split(" ")[1];
          socket.volatile.emit("removefriend", friendlist);
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
    read()
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
