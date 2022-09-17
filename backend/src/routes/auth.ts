import express from "express";
import { register, login } from "../controllers/auth";
import { body, CustomValidator, check } from "express-validator";
import { findUserByEmail } from "../db";
import { validationResultMiddleware } from "../utilis";

const router = express.Router();

const isEmailExist: CustomValidator = (email) => {
    return findUserByEmail(email).then((user) => {
        if (user) {
            return Promise.reject("E-mail already in use");
        }
    });
};

router.post(
    `/${login.name}`,
    body("email").trim().isEmail().normalizeEmail(),
    check("password").isLength({ min: 8 }).withMessage("must be at least 8 chars long"),
    validationResultMiddleware,
    login,
);
router.post(
    `/${register.name}`,
    body("email").trim().isEmail().normalizeEmail().custom(isEmailExist),
    check("password").isLength({ min: 8 }).withMessage("must be at least 6 chars long"),
    validationResultMiddleware,
    register,
);

export default router;
