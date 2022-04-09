require("dotenv").config();
import { Server } from "socket.io";
import { verifyLogin, register } from "./DataAccess/userData";
import { verifyRoom, createRoom, getRooms } from "./DataAccess/roomData";
import { saveMessage, historique } from "./DataAccess/messageData";
import { welcomeUser } from "./welcomeUser";
import { surprise, choc, carré } from "./surprise";
// import { rl } from "./client";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  io,
} from "./config";
import { colours } from "./colours";

// Variable utilisée pour gérer notre room par défaut
let main_room = String(process.env.MAIN_ROOM);

// Ici on gère les process une fois connecté sur le serveur
io.on("connection", (socket) => {
  // Petite surprise
  socket.on("surprise", () => {
    socket.to(socket.data.room_name).emit("chat message", surprise);
  });
  socket.on("choc", () => {
    socket.to(socket.data.room_name).emit("chat message", choc);
  });
  socket.on("carré", () => {
    socket.to(socket.data.room_name).emit("chat message", carré);
  });

  // Permet d'afficher les messages dans notre chat avec le nom d'utilisateur
  socket.on("chat message", async (msg) => {
    // console.log("Mes rooms ! : ", socket.rooms);

    // socket.emit("user_data", socket.id);
    socket
      .to(socket.data.room_name)
      .emit("chat message", socket.data.login + " : " + msg);

    if (socket.data.room_id && socket.data.id) {
      // Changer le stockage de la date en timestamp pour stocker l'heure
      const message = {
        user_id: socket.data.id,
        room_id: socket.data.room_id,
        content: msg,
        timestamp: new Date(),
      };

      // Stock le message dans la base de donnée
      await saveMessage(message)
        .then((res) => console.log(res))
        .catch((err) => console.log("Promise rejection error: " + err));
    }
  });
  //On connection to server
  socket.emit(
    "welcome",
    colours.bright +
      "\n\tBienvenue sur Chat Mate !\n" +
      colours.reset +
      colours.fg.green +
      "\nPour commencer à chater, connecte toi avec" +
      colours.bright +
      "'--login' <login>\n" +
      colours.reset +
      colours.fg.green +
      "Tu peux t'inscrire avec " +
      colours.bright +
      "'--register <Login> <Password>'\n" +
      colours.reset +
      colours.fg.green +
      "Attention ! Les espaces ne sont pas acceptés.\n"
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
      socket.emit(
        "system message",
        colours.reset +
          colours.fg.red +
          "Petit tricheur ! Cet utilisateur est déjà connecté !"
      );
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
            colours.reset + colours.fg.red + "Mauvais login / mot de passe"
          );
        }
      });

      // On demande à l'utilisateur de nous fournir son mdp à l'aide de notre commande
      socket.emit(
        "system message",
        "Entre ton mot de passe avec '--pass <votre mot de passe>'\n"
      );
    }
  });

  socket.on("pm", (dest, msg) => {
    let sender = socket.data.login;
    let isConnected = false;
    let connectedSockets = Array.from(io.of("/").adapter.sids.keys());
    connectedSockets.forEach((e) => {
      let s: any = io.sockets.sockets.get(e);
      if (s.data.login === dest) {
        isConnected = true;
        s.emit("pm", sender, msg);
      }
    });
    if (isConnected == false) {
      socket.emit(
        "system message",
        colours.reset + colours.fg.red + "Cet utilisateur n'est pas connecté"
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

  socket.on("create_room", async (input) => {
    // Si le user n'est pas co, on stop le process
    if (!checkAuth(socket)) {
      return;
    }

    await verifyRoom(input)
      .then((results: any) => {
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
          socket.emit(
            "system message",
            colours.reset + colours.fg.red + "Cette room existe déjà.\n"
          );
        }
      })

      .catch((err) => console.log("Promise rejection error: " + err));
  });

  socket.on("get_all_user", async () => {
    const sockets = await io.fetchSockets();
    let userList: Array<{}> = [];
    let unauthentifiedUser: number = 0;
    sockets.forEach((e) => {
      if (e.data.login !== undefined) {
        userList.push(e.data.login);
      } else {
        unauthentifiedUser += 1;
      }
    });
    socket.emit(
      "system message",
      "Utilisateurs connectés : " +
        colours.bright +
        userList +
        colours.reset +
        colours.fg.green +
        "\nIl y a aussi " +
        colours.bright +
        unauthentifiedUser +
        colours.reset +
        colours.fg.green +
        " invité(s)."
    );
  });

  socket.on("get_rooms", async () => {
    await getRooms()
      .then((results: any) => {
        socket.emit("arr", results);
      })
      .catch((err) => console.log("Promise rejection error: " + err));
  });

  //JOIN ROOM
  socket.on("join_room", async (input) => {
    let connectedRooms = Array.from(io.of("/").adapter.rooms.keys());
    await verifyRoom(input)
      .then((results: any) => {
        if (results[0] == undefined) {
          socket.emit(
            "system message",
            colours.reset +
              colours.fg.red +
              "La room n'existe pas. Utilisez '--create_room' ou '--list_room'"
          );
        } else {
          socket.data.room_id = results[0].id;
          socket
            .to(socket.data.room_name)
            .emit("system message", socket.data.login + " a quitté la room");
          socket.leave(socket.data.room_name);
          socket.join(input);
          socket.data.room_name = input;
          socket.emit("system message", "Bienvenue sur " + input);
          socket
            .to(input)
            .emit("system message", socket.data.login + " a rejoint la room.");
        }
        socket.data.room_id = results[0].id;
        console.log("room id ici : ", socket.data.room_id);
        console.log("infos room : ", results[0].id, results[0].room_name);
      })
      .catch((err) => console.log("Promise rejection error: " + err));
  });

  // Gère l'historique
  socket.on("hist", async () => {
    const room_id: any = socket.data.room_id;

    await historique(room_id)
      .then((res) => {
        socket.emit("hist", res, socket.data.room_name);
      })
      .catch((err) => console.log("Promise rejection error: " + err));
  });
});

/**
 * Checks if user is authenticated. If not, sends error message.
 *
 * @param socket user socket
 * @returns true if user is authenticated, false if not
 */
function checkAuth(socket: any) {
  if (!socket.data.id) {
    socket.emit(
      "system message",
      colours.reset +
        colours.fg.red +
        "Error : Vous devez etre authentifié\t(--login)"
    );
    return false;
  } else {
    return true;
  }
}
