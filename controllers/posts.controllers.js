import mssql from "mssql";
import { config } from "../db/config.js";
import { checkIfUserExists } from "../utils/utils.js";
import crypto from "crypto";

const pool = new mssql.ConnectionPool(config.sql);
await pool.connect();

export const getAllPosts = async (req, res) => {
  try {
    const posts = await pool.request().query("SELECT * FROM posts");
    if (posts.recordsets[0].length <= 0)
      return res.status(204).json({ message: "No posts at this time" });
    return res.status(200).json(posts.recordsets[0]);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const createPost = async (req, res) => {
  const { username, image, text } = req.body;
  if (!username)
    return res.status(400).json({ message: "Username is required" });
  try {
    if (await checkIfUserExists(username)) {
      if (image && text) {
        const post_id = crypto.randomUUID();
        await pool
          .request()
          .input("post_id", mssql.VarChar, post_id)
          .input("username", mssql.VarChar, username)
          .input("image", mssql.VarChar, image)
          .input("text", mssql.Text, text)
          .query(
            "INSERT INTO posts (post_id, author, text, image) VALUES(@post_id, @username, @text, @image)"
          );
        return res.status(200).json({ message: "Post published successfully" });
      } else if (image) {
        const post_id = crypto.randomUUID();
        await pool
          .request()
          .input("post_id", mssql.VarChar, post_id)
          .input("username", mssql.VarChar, username)
          .input("image", mssql.VarChar, image)
          .query(
            "INSERT INTO posts (post_id, author, image) VALUES(@post_id, @username, @image)"
          );
        return res.status(200).json({ message: "Post published successfully" });
      } else if (text) {
        const post_id = crypto.randomUUID();
        await pool
          .request()
          .input("post_id", mssql.VarChar, post_id)
          .input("username", mssql.VarChar, username)
          .input("text", mssql.Text, text)
          .query(
            "INSERT INTO posts (post_id, author, text) VALUES(@post_id, @username, @text)"
          );
        return res.status(200).json({ message: "Post published successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "Please provide either an image, or text or both" });
      }
    } else {
      return res.status(401).json({ message: "User does not exist" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const getPost = async (req, res) => {
  const { post_id } = req.params;
  if (!post_id) return res.status(404).json({ message: "Post not found" });
  try {
    const post = await pool
      .request()
      .input("post_id", mssql.VarChar, post_id)
      .query("SELECT * FROM posts WHERE post_id = @post_id");
    if (post.recordset.length <= 0) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      return res.status(200).json(post.recordset[0]);
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

export const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { image, text, username } = req.body;
  if (!(await checkIfUserExists(username)))
    return res.status(401).json({ message: "User does not exist" });
  if (!post_id) return res.status(404).json({ message: "Post not found" });

  try {
    let updateQuery = "UPDATE posts SET";
    const inputParameters = pool.request();
    if (image) {
      inputParameters.input("image", mssql.VarChar, image);
      updateQuery += " image = @image,";
    }
    if (text) {
      inputParameters.input("text", mssql.Text, text);
      updateQuery += " text = @text,";
    }
    updateQuery += " lastUpdated = GETDATE()";
    inputParameters.input("author", mssql.VarChar, username);
    updateQuery += " WHERE author = @author";
    inputParameters.input("post_id", mssql.VarChar, post_id);
    updateQuery += " AND post_id = @post_id";

    const result = await inputParameters.query(updateQuery);

    if (result.rowsAffected[0] > 0) {
      return res.status(200).json({ message: "Update done successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "No update done, maybe you don't own the post" });
    }

    return res.status(200).json(result);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

export const deletePost = async (req, res) => {
  const { username } = req.body;
  const { post_id } = req.params;
  if (!username)
    return res.status(401).json({ message: "Username/author is required" });
  try {
    const userOwnsPost = await pool
      .request()
      .input("username", mssql.VarChar, username)
      .input("post_id", mssql.VarChar, post_id)
      .query(
        "SELECT * FROM posts WHERE author = @username AND post_id = @post_id"
      );

    if (!userOwnsPost.recordset.length) {
      return res
        .status(401)
        .json({
          message:
            "There was an error: either you don't own the post or it doesn't exist ",
        });
    } else {
      await pool
        .request()
        .input("username", mssql.VarChar, username)
        .input("post_id", mssql.VarChar, post_id)
        .query(
          "DELETE FROM posts WHERE author = @username AND post_id = @post_id"
        );
      return res.status(200).json({ message: "Post deleted successfully" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
