import express from "express";
import {
    signupUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserSubscription, updateAvatar
} from "../../controllers/userController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { validateSignup, validateSubscription } from "../../middlewares/validation.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

/* POST: // http://localhost:3000/api/users/signup
{
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post("/signup", validateSignup, signupUser);

/* POST: // http://localhost:3000/api/users/login
{
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post("/login", validateSignup, loginUser);

/* GET: // http://localhost:3000/api/users/logout */
router.get("/logout", authenticateToken, logoutUser);

/* GET: // http://localhost:3000/api/users/current */
router.get("/current", authenticateToken, getCurrentUser);

/* PATCH: // http://localhost:3000/api/users/
{
    "subscription":"pro"
}
*/
router.patch("/", authenticateToken, validateSubscription, updateUserSubscription);

router.patch("/avatars", authenticateToken, upload.single("avatar"), updateAvatar);

export default router;