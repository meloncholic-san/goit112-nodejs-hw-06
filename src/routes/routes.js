import { Router } from "express";
import contactRoutes from "./contacts.js"
import authRoutes from "./auth.js"
import { auth } from "../middlewares/auth.js";
const router = Router();

router.use('/contacts', auth, contactRoutes);
router.use('/auth', authRoutes);
export default router;