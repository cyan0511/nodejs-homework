import express from "express";
import {
    signupUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserSubscription
} from "../../controllers/userController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import {validateSignup, validateSubscription} from "../../middlewares/validation.js";
import * as v8 from "node:v8";

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

export default router;