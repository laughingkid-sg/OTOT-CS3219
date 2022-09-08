import { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).send({ message: err.message }); // Bad request
    }
    next();
};

export { errorHandler };
