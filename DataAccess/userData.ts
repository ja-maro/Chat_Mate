import { connection } from "../db-connection";

export function verifyLogin(login: string) {
  const sql = "SELECT * FROM user WHERE user_login= ?;";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [login], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
}

export function register(credentials: Object) {
  const sql = "INSERT INTO user SET ?;";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [credentials], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
}

//fournir user_login friend_login dans Friend_list;
//je ne sais pas comment intégrer le user_login qui est attaché à socket.data.id, ici. 
//il faut corriger le query sql
export function addfriend(friend: Object) {
  //const user_id = socket.data.id; 
  const sql = "INSERT INTO Friend_list(user_id, friend_id) VALUES (user_id, (SELECT user_id FROM user WHERE user_login=${friend_login}));";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [friend], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
}

//encore je ne sais pas comment intégrer le user_login qui est attaché à socket.data.id, ici. 
export function removefriend(friend: Object) {
  const sql = "DELETE FROM Friend_list(user_id, friend_id) WHERE user_id=user_id AND friend_id LIKE (SELECT user_id FROM user WHERE user_login=${friend_login});";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [friend], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
}

//afficher la friendlist; 
//il faut corriger le query sql
export function friendlist(friendlist: Object) {
  //encore je ne sais pas comment intégrer le user_login qui est attaché à socket.data.id, ici. 
  const sql = "SELECT (SELECT user_id FROM user WHERE user_login='${friend_login}') FROM Friend_list WHERE user_id='user_id';";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [friendlist], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
}









// export function register(user: any) {
//   const sql = "INSERT INTO user SET ?";
//   return connection.promise().query(sql, [user]);
// }
