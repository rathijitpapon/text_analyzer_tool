import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { getUserResponseSchema, GetUserResponse } from "../../validations/auth/getUser";
import { ResponseHandler } from "../../middlewares/response";

export class GetUserController implements Controller {
    constructor() {}

    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "No user exists");
            }
            
            const profile = req.user as any;
            const user: GetUserResponse = {
                name: profile.displayName,
                email: profile.email,
                picture: profile.picture || undefined,
            }

            await new ResponseHandler(req, res, next, httpStatus.OK, user, getUserResponseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}