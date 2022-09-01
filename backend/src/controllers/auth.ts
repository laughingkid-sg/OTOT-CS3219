import { Request, Response } from "express";
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


export { register, login };
