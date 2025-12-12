import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// this test if the authentication to get user is valid
router.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user,
  });
});

export default router;
