require("dotenv").config();
import { io } from "./config";

// Variable utilisé pour gérer notre room par défaut
let main_room = String(process.env.MAIN_ROOM);

export const welcomeUser = (socket: any) => {
  // On accueil l'utilisateur connecté
  socket.emit("system message", "Bienvenue " + socket.data.login);
  socket.emit("hello", "===START_CHATING===");

  // On fait rejoindre la room par defaut à notre user
  socket.join(main_room);
  socket
    .to(main_room)
    .emit("system message", socket.data.login + " has joined the room.");

  //Récupère la liste des rooms actuellement sur le serveur
  let rooms: string[] = Array.from(io.of("/").adapter.rooms.keys());
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
    "Bienvenue sur " + main_room + " !\n" + available_rooms
  );
};
