import mssql from "mssql";
import { config } from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const jwtSalt = config.jwtSalt;

const pool = new mssql.ConnectionPool(config.sql);
await pool.connect();

export const loginUser = async (req, res) => {
  const { loginEntity, password } = req.body;
  if (!password && !loginEntity)
    return res
      .status(400)
      .json({ message: `Username/email address and password are required` });
  try {
    const user = await pool
      .request()
      .input("loginEntity", mssql.VarChar, loginEntity)
      .query(
        "SELECT * FROM users WHERE username = @loginEntity OR emailAddress = @loginEntity"
      );
    if (user.recordset.length <= 0) {
      return res.status(404).json({
        message: `Login entity ${loginEntity} did not match any records`,
      });
    } else {
      const userLoginIn = user.recordset[0];
      if (bcrypt.compareSync(password, userLoginIn.password)) {
        const userPayload = {
          username: userLoginIn.username,
          firstName: userLoginIn.firstName,
          lastName: userLoginIn.lastName,
          emailAddress: userLoginIn.emailAddress,
          statusText: userLoginIn.statusText,
          profilePhoto: userLoginIn.profilePhoto,
          coverPhoto: userLoginIn.coverPhoto,
          dateCreated: userLoginIn.dateCreated,
          dateUpdated: userLoginIn.dateUpdated,
        };
        jwt.sign(userPayload, jwtSalt, {}, (err, token) => {
          if (err) throw err;
          return res.cookie("token", token).json(userPayload);
        });
      } else {
        return res.status(401).json({ message: "Wrong password" });
      }
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
