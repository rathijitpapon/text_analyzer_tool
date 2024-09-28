import { z } from "zod";
import { validateRequestPayload } from "../../middlewares/request";

// Get Text Schema
export const getAllTextsSchema = z.object({});

// Get Text Request Validator
export const getAllTextsValidator = validateRequestPayload(getAllTextsSchema);

// Get Text Request Type
export type GetAllTextsRequest = z.infer<typeof getAllTextsSchema>;

// Get Text Response Schema
export const getAllTextsResponseSchema = z.array(
    z.object({
        id: z.string().uuid(),
        userId: z.string(),
        text: z.string().min(1),
        wordCount: z.number(),
        characterCount: z.number(),
        sentenceCount: z.number(),
        paragraphCount: z.number(),
        longestParagraphWords: z.array(z.string()),
    })
);

// Get Text Response Type
export type GetAllTextsResponse = z.infer<typeof getAllTextsResponseSchema>;