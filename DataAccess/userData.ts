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



export function add_friend(friend: Object) {
  const sql = "INSERT INTO Friend_list SET ?;";
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







// export function register(user: any) {
//   const sql = "INSERT INTO user SET ?";
//   return connection.promise().query(sql, [user]);
// }
