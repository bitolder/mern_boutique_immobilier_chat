import express from "express";
import {
  checkAuth,
  google,
  signOut,
  signin,
  signup,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", signOut);
router.get("/check", verifyToken, checkAuth);
router.put("/update-profile", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
export default router;
