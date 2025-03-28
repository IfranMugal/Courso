import express from "express";
import {userLogin, userLogout, userPurchases, userSignup} from "../controllers/usercontroller.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/signup",userSignup)
router.post("/login",userLogin)
router.post("/logout",userLogout)
router.get("/purchases",userMiddleware,userPurchases)

export default router