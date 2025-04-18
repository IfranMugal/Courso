import express from 'express'
import { adminLogin, adminLogout, adminSignup } from '../controllers/admincontroller.js';

const router = express.Router();

router.post("/signup",adminSignup)
router.post("/login",adminLogin)
router.post("/logout",adminLogout)

export default router;