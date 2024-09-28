import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { getAllTextsResponseSchema } from "../../validations/text/getAllTexts";
import { GetAllTextsAction } from "../../actions/text/getAllTexts";
import { ResponseHandler } from "../../middlewares/response";

export class GetAllTextsController implements Controller {
    constructor() {}
    
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req.user as any).id;
            const result = await new GetAllTextsAction(userId).execute();

            await new ResponseHandler(req, res, next, httpStatus.OK, result, getAllTextsResponseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}