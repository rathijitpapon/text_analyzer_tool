import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { CreateNewTextRequest, createNewTextResponseSchema } from "../../validations/text/createNewText";
import { CreateNewTextAction } from "../../actions/text/createText";
import { ResponseHandler } from "../../middlewares/response";

export class CreateNewTextController implements Controller {
    private requestPayload: CreateNewTextRequest;

    constructor(payload: CreateNewTextRequest) {
        this.requestPayload = payload;
    }

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req.user as any).id;
            const text = await new CreateNewTextAction(
                this.requestPayload.text,
                userId,
            ).execute();

            await new ResponseHandler(req, res, next, httpStatus.CREATED, text, createNewTextResponseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}