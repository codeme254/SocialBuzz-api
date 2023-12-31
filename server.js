import express from "express";
import { config } from "./db/config.js";
import userRoutes from "./routes/users.routes.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import followsRoute from "./routes/follows.routes.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

userRoutes(app);
authRoutes(app);
postRoutes(app);
commentsRoutes(app);
followsRoute(app);

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`SocialBuzz server running on port ${PORT}...`);
});
