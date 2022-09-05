import { Request, Response } from "express";
import { getAllCoins } from "../db";

const list = async (req: Request, res: Response) => {
    try {
        const coins = await getAllCoins();
        return res.json(coins).send();
    } catch {
        return res.status(500).send();
    }
};

export { list };
