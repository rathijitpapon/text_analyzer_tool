import { z } from "zod";
import { validateRequestPayload } from "../../middlewares/request";

// Get User Schema
export const getUserSchema = z.object({});

// Get User Request Validator
export const getUserValidator = validateRequestPayload(getUserSchema);

// Get User Request Type
export type GetUserRequest = z.infer<typeof getUserSchema>;

// Get User Response Schema
export const getUserResponseSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    picture: z.string().url().optional(),
});

// Get User Response Type
export type GetUserResponse = z.infer<typeof getUserResponseSchema>;
