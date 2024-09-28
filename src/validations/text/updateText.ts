import { z } from "zod";
import { validateRequestPayload } from "../../middlewares/request";

// Update Text Schema
export const updateTextSchema = z.object({
    id: z.string().uuid(),
    text: z.string().min(1),
});

// Update Text Request Validator
export const updateTextValidator = validateRequestPayload(updateTextSchema);

// Update Text Request Type
export type UpdateTextRequest = z.infer<typeof updateTextSchema>;

// Update Text Response Schema
export const updateTextResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    text: z.string().min(1),
    wordCount: z.number(),
    characterCount: z.number(),
    sentenceCount: z.number(),
    paragraphCount: z.number(),
    longestParagraphWords: z.array(z.string()),
});

// Update Text Response Type
export type UpdateTextResponse = z.infer<typeof updateTextResponseSchema>;