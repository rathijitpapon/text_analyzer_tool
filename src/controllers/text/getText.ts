import httpStatus from "http-status";
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { GetTextRequest } from "../../validations/text/getText";
import { GetTextAction } from "../../actions/text/getText";
import { ResponseHandler } from "../../middlewares/response";

export class GetTextController implements Controller {
    private requestPayload: GetTextRequest;
    private responseSchema: ZodSchema<any>;

    constructor(payload: GetTextRequest, responseSchema: ZodSchema<any>) {
        this.requestPayload = payload;
        this.responseSchema = responseSchema;
    }
    
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = this.requestPayload;
            const result = await new GetTextAction(id).execute();

            await new ResponseHandler(req, res, next, httpStatus.OK, result, this.responseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}