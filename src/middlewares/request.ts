import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { parseZodSchema } from '../utils/zod';

const getRequestPayload = (req: Request): Object => {
  const payload = {
    ...req.body,
    ...req.query,
    ...req.params,
  };

  return payload;
}

export const setDefaultRequestProperties = (req: Request, res: Response, next: NextFunction) => {
  // req.startTime = new Date();
  next();
}

export const validateRequestPayload = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = getRequestPayload(req)
    if (!payload) {
      req.body = {};
      next();
      return;
    }

    req.body = parseZodSchema(schema, payload);
    next();
  }
}
