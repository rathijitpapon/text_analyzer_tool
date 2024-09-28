import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { Controller } from "../../types/controller";
import { deleteTextResponseSchema, DeleteTextRequest } from "../../validations/text/deleteText";
import { DeleteTextAction } from "../../actions/text/deleteText";
import { ResponseHandler } from "../../middlewares/response";

export class DeleteTextController implements Controller {
    private requestPayload: DeleteTextRequest;

    constructor(payload: DeleteTextRequest) {
        this.requestPayload = payload;
    }
    
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = this.requestPayload;
            await new DeleteTextAction(id).execute();

            await new ResponseHandler(req, res, next, httpStatus.OK, {}, deleteTextResponseSchema).execute();
        } catch (error: ApiError | any) {
            next(error);
        }
    }
}