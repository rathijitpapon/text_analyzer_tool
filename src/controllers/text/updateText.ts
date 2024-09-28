import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { updateTextResponseSchema, UpdateTextRequest } from "../../validations/text/updateText";
import { UpdateTextAction } from "../../actions/text/updateText";
import { ResponseHandler } from "../../middlewares/response";

export class UpdateTextController implements Controller {
    private requestPayload: UpdateTextRequest;

    constructor(payload: UpdateTextRequest) {
        this.requestPayload = payload;
    }
    
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req.user as any).id;
            const { text, id } = this.requestPayload;
            const result = await new UpdateTextAction(text, id, userId).execute();

            await new ResponseHandler(req, res, next, httpStatus.OK, result, updateTextResponseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}
