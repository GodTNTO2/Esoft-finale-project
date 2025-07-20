import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../Error/BadRequestError';

type ValidationTarget = 'body' | 'params' | 'query'

export class ValidateRequestMiddleware {
    constructor(
        private schema: z.ZodSchema,
        private target: ValidationTarget = 'body'
    ) {}
        execute (req: Request, res: Response, next: NextFunction) {
            
        try {
            const dataToValidate = this.getDataFromRequest(req)
            console.log(dataToValidate)
            const result = this.schema.safeParse(dataToValidate)

            if (!result.success) {
                const errors = result.error.issues.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
                throw new BadRequestError("Validation error", { errors })
            }

            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
            const errors = error.issues.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))
            throw new BadRequestError("Validation error", { errors })
            }
            next(error)
        }
    }

    private getDataFromRequest(req: Request): unknown {
        switch (this.target) {
            case 'body':
                return req.body;
            case 'params':
                return req.params;
            case 'query':
                return req.query;
            default:
                return {};
        }
    }
}