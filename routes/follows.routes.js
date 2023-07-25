import {
  follow,
  unFollow,
  getUsersNotFollowedByCurrentUser,
} from "../controllers/follows.controller.js";

const followsRoute = (app) => {
  app.route("/follows/:followed/:follower").post(follow).delete(unFollow);

  app
    .route("/follows/not_following/:username")
    .get(getUsersNotFollowedByCurrentUser);
};

export default followsRoute;
