import { argv } from "node:process";
require("dotenv").config();
import { Server } from "socket.io";
import { verifyLogin, register } from "./DataAccess/userData";

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
}

export interface ClientToServerEvents {
  hello: (arg: string) => any;
  "chat message": (msg: string) => void;
  login: (msg: string) => void;
  pwd: (msg: string) => void;
}

interface SocketData {
  id: number;
  login: string;
  password: string;
}

// I create my server
const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  port
);
const default_room: string = "#default-room";

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("reçu: " + msg);
    socket.to(default_room).emit("chat message", socket.data.login + " : " + msg);
  });

  //On connection to server
  socket.emit("system message",
    "Connecte toi avec '--login <ton login>'\nLes espaces ne sont pas acceptés.");
  
  socket.on("login", (input) => {
    const login = input;
    
    const data = verifyLogin(login);
    console.log(data);
    
    socket.emit("system message",
      "Entre ton mot de passe avec '--pwd <votre mot de passe>'\nLes espaces ne sont pas acceptés.");
    socket.on("login", (input) => {
      const password = input;
      //TODO
    })
  })

  socket.emit("hello", "===START_CHATING===");
  socket.join(default_room);
  socket.to(default_room).emit("system message", 
  socket.data.login + " has joined the room.");
  
  //Récupère la liste des rooms actuellement sur le serveur
  let rooms = Array.from(io.of("/").adapter.rooms.keys());
  let available_rooms: string = "Les rooms disponibles sont :";
  //On exclut les rooms uniques à chaque socket 
  // (Penser à utiliser '#' au début du nom des rooms créées !)
  rooms.forEach(element => {
    if (element.startsWith("#")) {
      available_rooms += "\n" + element;
    }
  });
  socket.emit("system message", "Bienvenue sur " + default_room + " !\n" + available_rooms)
});