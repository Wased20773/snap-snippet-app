import cors from "cors";
import express from "express";
import userRoutes from "../src/routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes); // test to verify authentication process

export default app;
