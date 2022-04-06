import { connection } from "../db-connection";

export function verifyLogin(login :string) {
    const sql = "SELECT * FROM user WHERE user_login = ?";
    return connection.promise().query(sql, [login]);
  }

export function register(user :any) {
    const sql = "INSERT INTO user SET ?";
    return connection.promise().query(sql, [user]);
}