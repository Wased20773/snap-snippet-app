import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import scanRoutes from "./routes/scan.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/scan", scanRoutes);

export default app;
