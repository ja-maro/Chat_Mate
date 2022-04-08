import { connection } from "../db-connection";

export function saveMessage(message: Object) {
  const sql = "INSERT INTO Message SET ?";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [message], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined" + err));
      } else {
        resolve(rows);
      }
    });
  });
}

export function historique(room_id: number) {
  const sql =
    "SELECT m.content, u.user_login FROM Message AS m JOIN user AS u ON u.id=m.user_id WHERE m.room_id = ?";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [room_id], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined" + err));
      } else {
        resolve(rows);
      }
    });
  });
}
