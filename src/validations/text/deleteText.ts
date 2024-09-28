import { z } from "zod";
import { validateRequestPayload } from "../../middlewares/request";

// Delete Text Schema
export const deleteTextSchema = z.object({
    id: z.string().uuid(),
});

// Delete Text Request Validator
export const deleteTextValidator = validateRequestPayload(deleteTextSchema);

// Delete Text Request Type
export type DeleteTextRequest = z.infer<typeof deleteTextSchema>;

// Delete Text Response Schema
export const deleteTextResponseSchema = z.object({});

// Delete Text Response Type
export type DeleteTextResponse = z.infer<typeof deleteTextResponseSchema>;