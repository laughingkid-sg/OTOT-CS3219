import express from "express";
import { list } from "../controllers/user";
import { adminOnly, roleChecker } from "../utilis";

const router = express.Router();

const pathname = "user";

router.get(`/${pathname}`, roleChecker(adminOnly), list);

export default router;
