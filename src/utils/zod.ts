import z, { ZodSchema } from 'zod';
import httpStatus from 'http-status';
import { ApiError } from './apiError';

export function parseZodSchema(schema: ZodSchema, payload: any): z.infer<typeof schema> {
    const result = schema.safeParse(payload);

    if (!result.success) {
        const messages = [];

        for (const [key, value] of Object.entries(result.error.flatten().fieldErrors)) {
            messages.push(`${key} - ${value}`);
        }
        const message = messages.length ? messages.join('. ') : 'Zod Schema Payload Validation Error';

        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, `Unable to parse zod schema payload. ${message}`);
    }

    return result.data;
}