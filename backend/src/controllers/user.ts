import { Request, Response } from "express";
import { getAllUser } from "../db";

const list = async (req: Request, res: Response) => {
  try {
      const users = await getAllUser();
      return res.json(users).send();
  } catch {
      return res.status(500).send();
  }
};

export {
  list
}