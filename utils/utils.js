import mssql from "mssql";
import { config } from "../db/config.js";
const pool = new mssql.ConnectionPool(config.sql);
await pool.connect();

export const checkIfUserExists = async (username) => {
  try {
    const user = await pool
      .request()
      .input("username", mssql.VarChar, username)
      .query("SELECT * FROM users WHERE username = @username");
    if (user.recordset.length > 0) return true;
    return false;
  } catch (e) {
    console.log(e.message);
  }
};

export const checkIfEmailIsTaken = async (emailAddress) => {
  try {
    const user = await pool
      .request()
      .input("emailAddress", mssql.VarChar, emailAddress)
      .query("SELECT * FROM users WHERE emailAddress = @emailAddress");
    if (user.recordset.length > 0) return true;
    return false;
  } catch (e) {
    console.log(e.message);
  }
};

// get all comments for a certain post
