import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { CreateNewTextRequest, createNewTextResponseSchema, CreateNewTextResponse } from "../../validations/text/createNewText";
import { CreateNewTextAction } from "../../actions/text/createText";
import { ResponseHandler } from "../../middlewares/response";

export class CreateNewTextController implements Controller {
    private requestPayload: CreateNewTextRequest;

    constructor(payload: CreateNewTextRequest) {
        this.requestPayload = payload;
    }

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const text = await new CreateNewTextAction(
                this.requestPayload.text,
            ).execute();

            const response: CreateNewTextResponse = text;

            await new ResponseHandler(req, res, next, httpStatus.CREATED, response, createNewTextResponseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}