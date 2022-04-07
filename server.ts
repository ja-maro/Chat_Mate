require("dotenv").config();
import { Server } from "socket.io";
import { verifyLogin, register } from "./DataAccess/userData";
import { verifyRoom, createRoom } from "./DataAccess/roomData";
import { welcomeUser } from "./welcomeUser";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  io,
} from "./config";


// Variable utilisée pour gérer notre room par défaut
let main_room = String(process.env.MAIN_ROOM);

// Ici on gère les process une fois connecté sur le serveur
io.on("connection", (socket) => { // Permet d'afficher les messages dans notre chat avec le nom d'utilisateur
  socket.on("chat message", (msg) => {
    console.log("reçu: " + msg);
    socket
      .to(socket.data.room_name)
      .emit("chat message", socket.data.login + " : " + msg);
  });
  //On connection to server
  socket.emit(
    "system message",
    "\n\tBienvenue sur Chat Mate !\n" +
      "\nTu peux te connecter avec '--login <Username>'\n" +
      "Tu peux également t'inscrire avec '--register <Login> <Password>'\n" +
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

          welcomeUser(socket);
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
    }
  });
  
  // Permet de s'inscrire
socket.on("register", async (input) => {
    const userCredentials = { user_login: input[0], user_password: input[1] };
    await register(userCredentials)
      .then((results: any) => {
        socket.data.id = results.insertId;
        socket.data.login = userCredentials.user_login;
        socket.data.password = userCredentials.user_password;
        welcomeUser(socket);
      })
      .catch((err) => console.log("Promise rejection error: " + err));
  });


  // le user veut créer une room
  // on vérifie qu'elle n'existe pas déjà dans la bdd
  // on le laisse rejoindre la room
  // S'il est seul comme une merde, on le prévient, parce qu'on est cool.
  //  Sinon on génère la liste des users

  socket.on("create_room", async (input) => {
    // Si le user n'est pas co, on stop le process
    if (!socket.data.id) {
      socket.emit(
        "system message",
        "Error : vous devez etre authentifié\t(--login)"
      );
      return;
    }

    console.log("input de create_room ici : " + input);
    await verifyRoom(input)
      .then((results: any) => {
        console.log("verifyRoom results : " + JSON.stringify(results[0]));
        if (results[0] == undefined) {
          // créer room ici en prenant l 'input et le user
          createRoom(input, socket.data.id)
            .then((results: any) => {
              socket
                .to(socket.data.room_name)
                .emit(
                  "system message",
                  socket.data.login + " a quitté la room"
                );
              socket.leave(socket.data.room_name);
              socket.data.room_id = Number(results.insertId);
              socket.data.room_name = String(input);
              console.log("room id : " + socket.data.room_id);
              socket.join(input);
              socket.emit(
                "system message",
                "Bienvenue sur " + socket.data.room_name + " !\n"
              );
            })
            .catch((err) => console.log("Promise rejection error: " + err));
        } else {
          socket.emit("system message", "Cette room existe déjà.\n");
        }
      })





      .catch((err) => console.log("Promise rejection error: " + err));
  });

  //attach the sockets to the server
  socket.on("addFriend", async (input) => {
    const friendCredentials = { user_id: input[0],user_login: input[1]};
      await register(friendCredentials)
        .then((results: any) => {
            socket.data.id = friendCredentials.user_id;
            socket.data.login = friendCredentials.user_login;
            welcomeUser(socket);
          })
          .catch((err) => console.log("Promise rejection error: " + err));
      }); 
  //also for friendlist
  /*socket.on("friendlist",)
        
  
  .catch((err) => console.log("Promise rejection error: " + err));
      }); */
});