import { Request, Response, NextFunction } from "express";
require("dotenv").config();

const authorisation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send();
        }

        if (token.split(" ")[0] === "Basic" && token.split(" ")[1] === process.env.BASIC_AUTH) {
            req.body.email = `demo@cs3219.com`;
            next();
        } else {
            return res.status(401).send();
        }
    } catch {
        return res.status(500).send();
    }
};

export { authorisation };
