import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsBelongingToAPost,
} from "../controllers/comments.controller.js";

const commentsRoutes = (app) => {
  app
    .route("/comments/:post_id")
    .post(createComment)
    .get(getCommentsBelongingToAPost);

  app.route("/comments/:comment_id").patch(updateComment).delete(deleteComment);
};

export default commentsRoutes;
