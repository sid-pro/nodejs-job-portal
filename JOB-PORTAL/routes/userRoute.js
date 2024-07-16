import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import { getUserDetailsController, updateUserController } from "../controllers/userController.js";

const router = express.Router();

// routes
router.put("/update-user", userAuth, updateUserController);
router.get("/get-user-details", userAuth, getUserDetailsController);

export default router;
