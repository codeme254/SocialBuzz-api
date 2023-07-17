import {
  getAllUsers,
  getUser,
  createUser,
  updateUserInformation,
  deleteUserInformation,
} from "../controllers/users.controller.js";

const userRoutes = (app) => {
  app.route("/users").get(getAllUsers).post(createUser);

  app
    .route("/users/:username")
    .get(getUser)
    .patch(updateUserInformation)
    .delete(deleteUserInformation);
};

export default userRoutes;
