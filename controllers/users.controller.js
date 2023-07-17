import mssql from "mssql";
import { config } from "../db/config.js";
import bcrypt from "bcrypt";
import { checkIfUserExists, checkIfEmailIsTaken } from "../utils/utils.js";
const pool = new mssql.ConnectionPool(config.sql);
await pool.connect();
const bcryptSaltRounds = 10;

export const getAllUsers = async (req, res) => {
  try {
    const users = await pool.request().query("SELECT * FROM users");
    if (users.recordset.length > 0) {
      return res.status(200).json(users.recordset);
    } else {
      return res.status(201).json({ message: "No users in db" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// console.log(await checkIfUserExists('jane_smith'));
// console.log(await checkIfEmailIsTaken("johnSSmith@gmail.com"))

export const getUser = async (req, res) => {
  const { username } = req.params;
  if (!username)
    return res.status(400).json({ message: "Username is required" });
  try {
    if (await checkIfUserExists(username)) {
      const user = await pool
        .request()
        .input("username", mssql.VarChar, username)
        .query("SELECT * FROM users WHERE username = @username");
      return res.status(200).json(user.recordset[0]);
    } else {
      return res
        .status(404)
        .json({ message: `User ${username} does not exist` });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    emailAddress,
    username,
    statusText,
    password,
    profilePhoto,
    coverPhoto,
  } = req.body;
  if (await checkIfEmailIsTaken(emailAddress))
    return res.status(409).json({ message: "Email address is already taken" });
  if (!password)
    return res.status(400).json({ message: `Password is required` });
  const passwordHash = bcrypt.hashSync(password, bcryptSaltRounds);
  try {
    await pool
      .request()
      .input("firstName", mssql.VarChar, firstName)
      .input("lastName", mssql.VarChar, lastName)
      .input("emailAddress", mssql.VarChar, emailAddress)
      .input("username", mssql.VarChar, username)
      .input("statusText", mssql.VarChar, statusText)
      .input("password", mssql.VarChar, passwordHash)
      .input("profilePhoto", mssql.VarChar, profilePhoto)
      .input("coverPhoto", mssql.VarChar, coverPhoto)
      .query(
        "INSERT INTO users (username, firstName, lastName, emailAddress, statusText, password, profilePhoto, coverPhoto) VALUES (@username, @firstName, @lastName, @emailAddress, @statusText, @password, @profilePhoto, @coverPhoto)"
      );
    return res
      .status(201)
      .json({ message: `Account for ${username} created successfully` });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

export const updateUserInformation = async (req, res) => {
  const { username } = req.params;
  const {
    firstName,
    lastName,
    emailAddress,
    statusText,
    password,
    profilePhoto,
    coverPhoto,
  } = req.body;
  try {
    let updateQuery = "UPDATE users SET";
    const inputParameters = pool.request();
    if (firstName) {
      inputParameters.input("firstName", mssql.VarChar, firstName);
      updateQuery += " firstName = @firstName, dateUpdated = GETDATE(),";
    }
    if (lastName) {
      inputParameters.input("lastName", mssql.VarChar, lastName);
      updateQuery += " lastName = @lastName, dateUpdated = GETDATE(),";
    }
    if (emailAddress) {
      inputParameters.input("emailAddress", mssql.VarChar, emailAddress);
      updateQuery += " emailAddress = @emailAddress, dateUpdated = GETDATE(),";
    }
    if (statusText) {
      inputParameters.input("statusText", mssql.VarChar, statusText);
      updateQuery += " statusText = @statusText, dateUpdated = GETDATE(),";
    }
    if (password) {
      inputParameters.input(
        "password",
        mssql.VarChar,
        bcrypt.hashSync(password, bcryptSaltRounds)
      );
      updateQuery += " password = @password, dateUpdated = GETDATE(),";
    }
    if (profilePhoto) {
      inputParameters.input("profilePhoto", mssql.VarChar, profilePhoto);
      updateQuery += " profilePhoto = @profilePhoto, dateUpdated = GETDATE(),";
    }
    if (coverPhoto) {
      inputParameters.input("coverPhoto", mssql.VarChar, coverPhoto);
      updateQuery += " coverPhoto = @coverPhoto, dateUpdated = GETDATE(),";
    }
    updateQuery = updateQuery.slice(0, -1);
    inputParameters.input("username", mssql.VarChar, username);
    updateQuery += " WHERE username = @username";

    await inputParameters.query(updateQuery);

    return res.status(200).json({
      message: `User information for ${username} updated successfully`,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const deleteUserInformation = async (req, res) => {
  const { username } = req.params;
  try {
    await pool
      .request()
      .input("username", mssql.VarChar, username)
      .query("DELETE FROM users WHERE username = @username");
    return res
      .status(204)
      .json({ message: "Successfully deleted the account" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
