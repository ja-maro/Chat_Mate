// Mes imports et type de mes fonctions asynchrones
require("dotenv").config();
const mysql = require("mysql2");
type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;
type PromiseReject = (error?: any) => void;


// Objet config me permettant de récupérer mes identifiants depuis le fichier .env
let config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
};

// Je créé une connection
const connection = mysql.createConnection(config);

// Je récupérer un user
connection.connect(function(err: any) {
  if (err) throw err; 
  console.log("vous êtes co")
  connection.query("SELECT user.id as 'user', user.user_login as 'login' FROM user ",
  function (err: any, result: any) {
    if (err) throw err;
    console.log(result);
  });
});

// Cette fonction me permet de couper ma connection
connection.closeConnection = () => {
  return new Promise(
    (resolve: PromiseResolve<number>, reject: PromiseReject) => {
      if (connection) {
        connection.end((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    }
  );
};

// J'exporte connection afin de l'utiliser plus tard (models etc...)
module.exports = connection;

function result(result: any) {
  throw new Error("Function not implemented.");
}

