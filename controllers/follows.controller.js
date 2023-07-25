import mssql from "mssql";
import { config } from "../db/config.js";
const pool = new mssql.ConnectionPool(config.sql);
await pool.connect();

export const follow = async (req, res) => {
  const { followed, follower } = req.params;
  if (followed === follower)
    return res.status(409).json({ message: "You cant follow yourself" });

  try {
    // Check if the relationship already exists in the database
    const existingRelationship = await pool
      .request()
      .input("followed", mssql.VarChar, followed)
      .input("follower", mssql.VarChar, follower)
      .query(
        "SELECT * FROM follows WHERE followed = @followed AND follower = @follower"
      );
    if (existingRelationship.recordset.length > 0) {
      return res
        .status(409)
        .json({ message: `You are already following ${followed}` });
    } else {
      await pool
        .request()
        .input("followed", mssql.VarChar, followed)
        .input("follower", mssql.VarChar, follower)
        .query(
          "INSERT INTO follows (followed, follower) VALUES (@followed, @follower)"
        );

      await pool
        .request()
        .input("followed", mssql.VarChar, followed)
        .query(
          "UPDATE users SET numberOfFollowers = numberOfFollowers + 1 WHERE username = @followed"
        );

      await pool
        .request()
        .input("follower", mssql.VarChar, follower)
        .query(
          "UPDATE users SET numberOfFollowing = numberOfFollowing + 1 WHERE username = @follower"
        );
      return res
        .status(200)
        .json({ message: `Successfully followed ${followed}` });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const unFollow = async (req, res) => {
  const { followed, follower } = req.params;
  try {
    const existingRelationship = await pool
      .request()
      .input("followed", mssql.VarChar, followed)
      .input("follower", mssql.VarChar, follower)
      .query(
        "SELECT * FROM follows WHERE followed = @followed AND follower = @follower"
      );
    if (existingRelationship.recordset.length <= 0)
      return res.status(400).json({
        message: `Cannot unfollow ${followed} because you don't follow them.`,
      });

    await pool
      .request()
      .input("followed", mssql.VarChar, followed)
      .input("follower", mssql.VarChar, follower)
      .query(
        "DELETE FROM follows WHERE followed = @followed AND follower = @follower"
      );

    return res
      .status(200)
      .json({ message: `Successfully unfollowed ${followed}` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const getUsersNotFollowedByCurrentUser = async (req, res) => {
  const { username } = req.params;
  try {
    const allUsers = await pool
      .request()
      .query(
        `SELECT username, firstName, lastName, emailAddress, statusText, 
        profilePhoto, coverPhoto, dateCreated, numberOfFollowers, numberOfFollowing, numberOfPosts FROM users 
        WHERE username != 'john_doe' AND username != 'jane_smith'`
      );
    const allUsersArray = allUsers.recordset;
    const usersNotFollowed = [];
    for (let i = 0; i < allUsersArray.length; i++) {
      const currentUser = allUsersArray[i].username;
      if (currentUser === username) continue;
      const relationshipExists = await pool
        .request()
        .input("followed", mssql.VarChar, currentUser)
        .input("follower", mssql.VarChar, username)
        .query(
          "SELECT * FROM follows WHERE followed = @followed AND follower = @follower"
        );
      console.log(relationshipExists);
      if (relationshipExists.recordset.length > 0) {
        // they follow each other
        console.log("They follow each other");
      } else {
        usersNotFollowed.push(allUsersArray[i]);
      }
    }
    return res.status(200).json(usersNotFollowed);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
