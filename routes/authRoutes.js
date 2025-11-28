import express from "express";
import { oauthLogin, registerUser ,loginUser} from "../controllers/authController.js";

const router = express.Router();


router.post("/oauth-login", oauthLogin);
router.post("/login", loginUser);


router.post("/register", registerUser);

export default router;
