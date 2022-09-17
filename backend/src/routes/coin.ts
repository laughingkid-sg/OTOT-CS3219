import express from "express";
import { clearCoinsCache, list, listNonCache } from "../controllers/coin";

const router = express.Router();

const pathname = "coin";

router.get(`/${pathname}`, list);
router.get(`/${pathname}/${clearCoinsCache.name}`, clearCoinsCache);
router.get(`/${pathname}/nonCache`, listNonCache);

export default router;
