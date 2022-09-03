import express from "express";
import { list } from "../controllers/coin";

const router = express.Router();

const pathname = "coin";

router.get(`/${pathname}/${list.name}`, list);

export default router;
