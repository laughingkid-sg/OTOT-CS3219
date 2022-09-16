import express from "express";
import { register, login } from "../controllers/auth";

const router = express.Router();

router.post(`/${login.name}`, login);
router.post(`/${register.name}`, register);

export default router;
