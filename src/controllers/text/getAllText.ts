import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { getAllTextsResponseSchema, GetAllTextsRequest } from "../../validations/text/getAllTexts";
import { GetAllTextsAction } from "../../actions/text/getAllTexts";
import { ResponseHandler } from "../../middlewares/response";

export class GetAllTextsController implements Controller {
    private requestPayload: GetAllTextsRequest;

    constructor(payload: GetAllTextsRequest) {
        this.requestPayload = payload;
    }
    
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await new GetAllTextsAction().execute();

            await new ResponseHandler(req, res, next, httpStatus.OK, result, getAllTextsResponseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}