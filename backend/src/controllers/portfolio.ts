import { Request, Response } from "express";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
    createPortfolio,
    deletePortfolio,
    getAllPortfolio,
    Portfolio,
    updatePortfolio,
} from "../db";

const list = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email!;
        const userPortfolio = await getAllPortfolio(email);
        return res.json(userPortfolio).send();
    } catch {
        return res.status(500).send();
    }
};

const add = async (req: Request, res: Response) => {
    try {
        const newPortfolio: QueryDeepPartialEntity<Portfolio> = {
            purchasePrice: req.body.purchasePrice! / 100,
            quantity: req.body.quantity!,
            coin: req.body.coin!,
            user: {
                email: req.body.email!,
            },
        };

        const newRecord: Portfolio = await createPortfolio(newPortfolio);

        return res.json(newRecord).send();
    } catch {
        return res.status(500).send();
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const id: string = req.body.id!;

        const updateData: QueryDeepPartialEntity<Portfolio> = {
            purchasePrice: req.body.purchasePrice! / 100,
            quantity: req.body.quantity!,
            coin: req.body.coin!,
        };

        const updatedPortfolio = await updatePortfolio(id, updateData);

        return res.json(updatedPortfolio).send();
    } catch {
        return res.status(500).send();
    }
};

const remove = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email!;
        const id: string = req.body.id!;

        const removedResult = await deletePortfolio(id, email);

        return res.json(removedResult).send();
    } catch {
        return res.status(500).send();
    }
};

export { list, add, update, remove };
