import { Coin, coinRepo } from "./../db/";
import express from "express";
import { list, add, remove, update } from "../controllers/portfolio";
import { validationResultMiddleware } from "../utilis";

const router = express.Router();
const { body } = require("express-validator");

const pathname = "portfolio";

router.post(
    `/${pathname}/${add.name}`,
    body("quantity")
        .exists()
        .isFloat({ min: 0.000000000000000001, max: 10000 })
        .withMessage("Quantity must be at between 0.000000000000000001 and 10000."),
    body("purchasePrice")
        .exists()
        .isInt({ min: 1, max: 100000000 })
        .withMessage("Purchase pirce must be at between $0.01 and $1,000,000)."),
    body("coin")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .custom(async (id: string) => {
            return coinRepo()
                .findOneBy({ id })
                .then((coin: Coin | null) => {
                    if (!coin) {
                        return Promise.reject("Coin is not supported!");
                    }
                });
        }),
    validationResultMiddleware,
    add,
);
router.get(`/${pathname}/${list.name}`, list);
router.put(
    `/${pathname}/${update.name}`,
    body("id").not().isEmpty().trim().escape().isUUID().withMessage("Invalid portfolio record ID."),
    body("quantity")
        .exists()
        .isFloat({ min: 0.000000000000000001, max: 10000 })
        .withMessage("Quantity must be at between 0.000000000000000001 and 10000."),
    body("purchasePrice")
        .exists()
        .isInt({ min: 1, max: 100000000 })
        .withMessage("Purchase pirce must be at between $0.01 and $1,000,000)."),
    body("coin")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .custom(async (id: string) => {
            return coinRepo()
                .findOneBy({ id })
                .then((coin: Coin | null) => {
                    if (!coin) {
                        return Promise.reject("Coin is not supported!");
                    }
                });
        }),
    validationResultMiddleware,
    update,
);
router.delete(
    `/${pathname}/${remove.name}`,
    body("id").not().isEmpty().trim().escape().isUUID().withMessage("Invalid portfolio record ID."),
    remove,
);

export default router;
