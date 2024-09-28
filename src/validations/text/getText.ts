import { z } from "zod";
import { validateRequestPayload } from "../../middlewares/request";

// Get Text Schema
export const getTextSchema = z.object({
    id: z.string().uuid(),
});

// Get Text Request Validator
export const getTextValidator = validateRequestPayload(getTextSchema);

// Get Text Request Type
export type GetTextRequest = z.infer<typeof getTextSchema>;

// Get Text Response Schema
export const getTextResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    text: z.string().min(1),
    wordCount: z.number(),
    characterCount: z.number(),
    sentenceCount: z.number(),
    paragraphCount: z.number(),
    longestParagraphWords: z.array(z.string()),
});

// Get Text Response Type
export type GetTextResponse = z.infer<typeof getTextResponseSchema>;

// Get Word Count Response Schema
export const getWordCountResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    wordCount: z.number(),
});

// Get Character Count Response Schema
export const getCharacterCountResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    characterCount: z.number(),
});

// Get Sentence Count Response Schema
export const getSentenceCountResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    sentenceCount: z.number(),
});

// Get Paragraph Count Response Schema
export const getParagraphCountResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    paragraphCount: z.number(),
});

// Get Longest Paragraph Words Response Schema
export const getLongestParagraphWordsResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    longestParagraphWords: z.array(z.string()),
});