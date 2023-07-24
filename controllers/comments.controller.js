import { checkIfUserExists } from "../utils/utils.js";
import mssql from "mssql";
import crypto from "crypto";
import { config } from "../db/config.js";

const pool = new mssql.ConnectionPool(config.sql);
await pool.connect();

export const createComment = async (req, res) => {
  const { post_id } = req.params;
  const { author, comment_text } = req.body;
  if (!(await checkIfUserExists(author)))
    return res.status(404).json({ message: "Failed: user not found" });
  if (!post_id)
    return res
      .status(400)
      .json({ message: "Post id is required to create a comment" });
  try {
    const comment_id = crypto.randomUUID();
    await pool
      .request()
      .input("comment_id", mssql.VarChar, comment_id)
      .input("post_id", mssql.VarChar, post_id)
      .input("comment_text", mssql.VarChar, comment_text)
      .input("author", mssql.VarChar, author)
      .query(
        "INSERT INTO comments (comment_id, author, post_id, comment_text) VALUES(@comment_id, @author, @post_id, @comment_text)"
      );

    await pool
      .request()
      .input("post_id", mssql.VarChar, post_id)
      .query(
        "UPDATE posts SET numberOfComments = numberOfComments + 1 WHERE post_id = @post_id"
      );
    return res.status(200).json({ message: "Comment added successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { author, comment_text } = req.body;
  if (!(await checkIfUserExists(author)))
    return res.status(404).json({ message: "Failed: user not found" });
  if (!post_id)
    return res
      .status(400)
      .json({ message: "Post id is required to update a comment" });
  try {
    const comment_id = crypto.randomUUID();
    await pool
      .request()
      .input("comment_id", mssql.VarChar, comment_id)
      .input("post_id", mssql.VarChar, post_id)
      .input("comment_text", mssql.VarChar, comment_text)
      .input("author", mssql.VarChar, author)
      .query(
        "INSERT INTO comments (comment_id, author, post_id, comment_text) VALUES(@comment_id, @author, @post_id, @comment_text)"
      );
    return res.status(200).json({ message: "Comment added successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const { author } = req.body;
  if (!(await checkIfUserExists(author)))
    return res.status(401).json({ message: "Cannot delete comment" });

  try {
    // try deleting the comment
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
