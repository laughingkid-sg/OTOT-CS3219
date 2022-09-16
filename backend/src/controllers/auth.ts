
import { Request, Response, NextFunction } from "express";
import { createUser, getPasswordHash } from "../db/handlers/User";
import { comparePassword, hashPassword } from "../utilis";
import jwt from "jsonwebtoken"
require("dotenv").config();

const register = async (req: Request, res: Response) => {
    const hashedPassword = await hashPassword(req.body.password);
    const user = await createUser({
        email: req.body.email,
        password: hashedPassword
    });
    res.status(200).json(user)
};

const login = async (req: Request, res: Response) => {
    
    const { email, password } = req.body
    const hashedPassword = await getPasswordHash(email)

    if (!hashedPassword) {
        return res.status(401).send()
    }

    const result = await comparePassword(password, hashedPassword!);
    if (result) {
        const token = jwt.sign({
            data: email
        }, process.env.SECRET!, { expiresIn: '1h' });
        return res.status(200).json(token);
    } else {
        return res.status(401).send();
    }
    
}

const basicAuth = Buffer.from(
    `${process.env.BASIC_USERNAME!}:${process.env.BASIC_PASSWORD!}`,
    "utf8",
).toString("base64");

const authorisation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send();
        }

        if (token.split(" ")[0] === "Basic" && token.split(" ")[1] === basicAuth) {
            req.body.email = `demo@cs3219.com`;
            next();
        } else {
            return res.status(401).send();
        }

        /*
            Setup middleware for implmenting JWT for Task C
            Task B will use basic auth with demo user role with ease of future integeration
            Demo user will be seeded with username 'demo@cs3219.com' and passsword '123456'.
            Basic auth credentials can be set indepdently from above values, as it will default to 'demo@cs3219.com'
        */
    } catch {
        return res.status(500).send();
    }
};

export { authorisation, register, login };
