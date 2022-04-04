// Je fais mes imports
require("dotenv").config();
import http from "http";

// Je créé un server http
const httpServer = http.createServer();
// Je récupère mon port depuis mon fichier .env ou 5000 si introuvable
const port = process.env.PORT || 5000;

// Je stock dans une variable server l'écoute de mon serveur
const server = httpServer.listen(port, () =>
  console.log(`Server is listening on port ${port}`)
);

// J'exporte mon écoute
module.exports = server;
