import express from "express";
import http from "http";

const app = express();
const httpServer = http.createServer(app);

httpServer.listen(8080, () => console.log("hello world"));
