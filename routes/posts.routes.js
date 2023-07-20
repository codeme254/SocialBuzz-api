import {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controllers.js";

const postRoutes = (app) => {
  app.route("/posts").get(getAllPosts).post(createPost);
  app
    .route("/posts/:post_id")
    .get(getPost)
    .patch(updatePost)
    .delete(deletePost);
};

export default postRoutes;
