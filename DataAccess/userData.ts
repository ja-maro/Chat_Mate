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

//fournir user_login friend_login dans Friend_list; il faut trouver user_id & friend_id pour y fournir à leurs place
export function addfriend(friend: Object) {
  const sql = "INSERT INTO Friend_list SET ? (SELECT user_id FROM user LEFT JOIN user_login ON user_id = friend.user_id));";
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

//afficher la friendlist; il faut trouver user_id puis SELECT friend_id FROM Friend_list WHERE user_id, puis trouver les user_login correspondant à chaque friend_login q___q
export function friendlist(friendlist: Object) {
  const sql = "SELECT friend_id FROM friend_list WHERE user_id AS (SELECT user_id FROM user WHERE user_login AS ?);";
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
