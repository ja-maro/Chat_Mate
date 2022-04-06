import { connection } from "../db-connection";

export function verifyRoom(room_name: string) {
  const sql = "SELECT * FROM room WHERE room_name = ?;";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [room_name], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
}

export function createRoom(room_name: string, user_admin_id: number) {
  const input = { room_name: room_name, user_admin_id: user_admin_id };
  const sql = "INSERT INTO room SET ?;";
  return new Promise(function (resolve, reject) {
    connection.query(sql, [input], function (err: any, rows: any) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
}
