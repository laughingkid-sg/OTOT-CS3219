import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Role } from "../db";

const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(8, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

const comparePassword = (password: string, hashed: string) => {
    return bcrypt.compare(password, hashed);
};

const roleChecker = (allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRoles: Role[] = req.body.role;
        const isAllowed = allowedRoles.find(
            (allowedRole) => allowedRole === userRoles.find((userRole) => userRole === allowedRole),
        );
        if (isAllowed !== undefined) {
            next();
        } else {
            return res.status(403).send();
        }
    };
};

const unauthenticatedRoutes = [
    `/api/register`,
    `/api/login`,
];

const adminOnly: Role[] = [Role.ADMIN];

export { hashPassword, comparePassword, roleChecker, unauthenticatedRoutes, adminOnly };
