import express from "express";
import { list } from "../controllers/user";

const router = express.Router();

const pathname = "user";

router.get(`/${pathname}`, list);

export default router;
