import express from "express";
import { config } from "./db/config.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
app.use(express.json());
userRoutes(app);

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`SocialBuzz server running on port ${PORT}...`);
});
