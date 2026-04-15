import express from 'express'
import { userLoginController, userLogoutController, userProfileController, userRegisterController } from '../controller/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/register", userRegisterController)
router.post("/login", userLoginController)
router.post("/logout", userLogoutController)
router.get("/profile", authenticateUser, userProfileController)

export default router;