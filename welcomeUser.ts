require("dotenv").config();
import { io } from "./config";
import { getRooms } from "./DataAccess/roomData";

// Variable utilisé pour gérer notre room par défaut
let main_room = String(process.env.MAIN_ROOM);

export const welcomeUser = async (socket: any) => {
  // On accueil l'utilisateur connecté
  socket.emit("hello", "Bienvenue " + socket.data.login);

  // On fait rejoindre la room par defaut à notre user
  socket.join(main_room);
  socket.data.room_name = main_room;
  socket.data.room_id = 1;
  socket
    .to(main_room)
    .emit("system message", socket.data.login + " a rejoint la room.");

  socket.emit(
    "system message",
    "Vous êtes dans " + main_room + "\n" + "Les rooms disponibles sont : "
  );

  await getRooms()
    .then((results: any) => {
      socket.emit("arr", results);
    })
    .catch((err) => console.log("Promise rejection error: " + err));
  socket.emit("hello", "===START CHATING===");
};
