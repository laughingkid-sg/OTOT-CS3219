
import { Request, Response, NextFunction } from "express";
import { createUser, getPasswordHash } from "../db/handlers/User";
import { comparePassword, hashPassword } from "../utilis";
require("dotenv").config();

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

export { authorisation };
