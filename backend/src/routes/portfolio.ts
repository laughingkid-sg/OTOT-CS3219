import express from "express";
import { list, add, remove, update } from "../controllers/portfolio";

const router = express.Router();

const pathname = "portfolio";

router.post(`/${pathname}/${add.name}`, add);
router.get(`/${pathname}/${list.name}`, list);
router.put(`/${pathname}/${update.name}`, update);
router.delete(`/${pathname}/${remove.name}`, remove);

export default router;
