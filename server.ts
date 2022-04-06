import { argv } from "node:process";
require("dotenv").config();
import { Server } from "socket.io";
import { verifyLogin } from "./DataAccess/userData";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./interface";
// import { connection } from "./db-connection";

// Variable utilisé pour gérer notre room par défaut
const default_room: string = "#default-room";

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

// I create my server
const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  port
);

// Ici on gère les process une fois connecté sur le serveur
io.on("connection", (socket) => {
  // Permet d'afficher les messages dans notre chat avec le nom d'utilisateur
  socket.on("chat message", (msg) => {
    console.log("reçu: " + msg);
    socket
      .to(default_room)
      .emit("chat message", socket.data.login + " : " + msg);
  });

  //On connection to server
  socket.emit(
    "system message",
    "\n\tBienvenue sur Chat Mate !\n" +
    "\nTu peux te connecter avec '--login <Login>'\n" +
    "Tu peux également t'inscrire avec '--register <Login> <Password>'\n"+
    "Les espaces ne sont pas acceptés.\n"
  );

  // Process de la commande --login
  socket.on("login", async (input) => {
    const login: string = input;
    let data = { id: "", user_login: "", user_password: "" };
    console.log("input login ici : " + input);

    // On vérifie si l'utilisateur est déjà connecté
    let isConnected = false;
    let connectedSockets = Array.from(io.of("/").adapter.sids.keys());
    connectedSockets.forEach((e) => {
      let socket: any = io.sockets.sockets.get(e);
      if (socket.data.login === login) {
        isConnected = true;
      }
    });

    // Si l'user est déjà connecté on stop le process
    if (isConnected) {
      socket.emit("system message", "This user is already logged in");
    } else {
      // On vérifie si le login existe dans la db
      await verifyLogin(login)
        .then((results: any) => {
          data.id = results[0].id;
          data.user_login = results[0].user_login;
          data.user_password = results[0].user_password;
        })
        .catch((err) => console.log("Promise rejection error: " + err));

      // Je check le mot de pass
      socket.on("pwd", (input) => {
        if (input === data.user_password) {
          // On stock dans socket data les informations de notre user
          socket.data.id = data.id;
          socket.data.login = data.user_login;
          socket.data.password = data.user_password;

          // On accueil l'utilisateur connecté
          socket.emit("system message", "Bienvenue " + socket.data.login);
          socket.emit("hello", "===START_CHATING===");

          // On fait rejoindre la room par defaut à notre user
          socket.join(default_room);
          socket
            .to(default_room)
            .emit(
              "system message",
              socket.data.login + " has joined the room."
            );

          //Récupère la liste des rooms actuellement sur le serveur
          let rooms = Array.from(io.of("/").adapter.rooms.keys());
          let available_rooms: string = "Les rooms disponibles sont :";

          //On exclut les rooms uniques à chaque socket
          // (Penser à utiliser '#' au début du nom des rooms créées !)
          rooms.forEach((element) => {
            if (element.startsWith("#")) {
              available_rooms += "\n" + element;
            }
          });

          // On accueil notre user sur notre default room à l'aide d'un message
          socket.emit(
            "system message",
            "Bienvenue sur " + default_room + " !\n" + available_rooms
          );
        } else {
          // Si le mot de pass est incorrect on préviens notre user
          socket.emit(
            "system message",
            "T'es MAUVAIS JACK ! LA PIQUETTE JACK !"
          );
        }
      });

      // On demande à l'utilisateur de nous fournir son mdp à l'aide de notre commande
      socket.emit(
        "system message",
        "Entre ton mot de passe avec '--pwd <votre mot de passe>'\nLes espaces ne sont pas acceptés."
      );

      socket.on("login", (input) => {
        const password = input;
        //TODO
      });
    }
  });
});
