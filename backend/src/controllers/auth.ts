import { Request, Response, NextFunction } from "express";
import { createUser, getUser } from "../db/handlers/user";
import { comparePassword, hashPassword, unauthenticatedRoutes } from "../utilis";
import jwt from "jsonwebtoken";
import { JwtDecoded } from "../types/jwt";
require("dotenv").config();

const secret = process.env.SECRET!;

const register = async (req: Request, res: Response) => {
    const hashedPassword = await hashPassword(req.body.password);
    try {
        const user = await createUser({
            email: req.body.email,
            password: hashedPassword,
        });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ err });
    }
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await getUser(email);

    if (!user) {
        return res.status(401).send();
    }

    const role = user.role;

    const result = await comparePassword(password, user.password);
    if (result) {
        const token = jwt.sign(
            {
                email,
                role,
            },
            secret,
            { expiresIn: "1h" },
        );
        return res.status(200).json({ token });
    } else {
        return res.status(401).send();
    }
};

const authentication = (req: Request, res: Response, next: NextFunction) => {
    if (
        unauthenticatedRoutes.find(
            (unauthenticatedRoute) =>
                unauthenticatedRoute === req.path || `${unauthenticatedRoute}/` === req.path,
        )
    ) {
        next();
        return;
    }

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send();
    }

    try {
        const decoded: JwtDecoded | string = jwt.verify(token.replace("Bearer ", ""), secret);
        req.body.email = decoded.email;
        req.body.role = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json(err);
    }
};

export { authentication, register, login };
