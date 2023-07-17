import { loginUser } from "../auth/auth.js";

const authRoutes = (app) => {
  app.route("/auth/users/login").post(loginUser);
};

export default authRoutes;
