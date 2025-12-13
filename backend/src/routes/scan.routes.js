import express from "express";
import { scanCode } from "../controllers/scan.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, scanCode);

export default router;
