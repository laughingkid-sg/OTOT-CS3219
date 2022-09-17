import { Request, Response } from "express";
import { getAllCoins } from "../db";
import { redisConnection } from "../redis";

const list = async (req: Request, res: Response) => {
    try {
        const coinsStr: string | null = await redisConnection.get("coins");

        if (coinsStr) {
            res.json(JSON.parse(coinsStr)).send();
            console.log("cached");
            return;
        } else {
            const coins = await getAllCoins();
            redisConnection.setEx("coins", 3600, JSON.stringify(coins));
            res.json(coins).send();
            console.log("non-cached");
            return;
        }
    } catch {
        return res.status(500).send();
    }
};

const clearCoinsCache = async (req: Request, res: Response) => {
    const result = await redisConnection.del("coins");
    return res.status(201).send();
};

const listNonCache = async (req: Request, res: Response) => {
    try {
        const coins = await getAllCoins();
        res.json(coins).send();
        console.log("non-cached");
        return;
    } catch {
        return res.status(500).send();
    }
};

export { list, clearCoinsCache, listNonCache };
