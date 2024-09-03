import { Router } from "express";
const router = Router();
import {
  login,
  register,
  logout,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";
import auth from "../middelwares/auth.js";

router.post("/login", login);
router.post("/register", register);
router.get("/logout", auth, logout);
router.get("/user/:id", auth, getUser);
router.put("/user/:id", auth, updateUser);
router.delete("/user/:id", auth, deleteUser);

export default router;
