import { z } from "zod";
import { validateRequestPayload } from "../../middlewares/request";

// Create New Text Request Schema
export const createNewTextSchema = z.object({
    text: z.string(),
});

// Create New Text Request Validator
export const createNewTextValidator = validateRequestPayload(createNewTextSchema);

// Create New Text Request Type
export type CreateNewTextRequest = z.infer<typeof createNewTextSchema>;

// Create New Text Response Schema
export const createNewTextResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    text: z.string().min(1),
    wordCount: z.number(),
    characterCount: z.number(),
    sentenceCount: z.number(),
    paragraphCount: z.number(),
    longestParagraphWords: z.array(z.string()),
});

// Create New Text Response Type
export type CreateNewTextResponse = z.infer<typeof createNewTextResponseSchema>;