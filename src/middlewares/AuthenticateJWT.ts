import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

declare module "express" {
    export interface Request {
        userId?: string; // added userId
        Role?: string;
        refreshToken?: string;
    }
}

const authenticateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"] as string;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(403).json({
            message: "No token provided or invalid format",
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    verify(
        token,
        process.env.JWTSECRET as string,
        (err, decoded: string | JwtPayload | undefined): void => {
            if (err || !decoded) {
                res.status(401).json({ message: "Invalid token" });
                console.log(err)
                return;
            }

            req.userId = (decoded as JwtPayload).id as string;
            req.Role = (decoded as JwtPayload).role as string;
            next();
        }
    );
};

export default authenticateJWT;
