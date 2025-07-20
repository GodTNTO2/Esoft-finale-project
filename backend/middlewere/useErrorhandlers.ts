import { Request, Response, NextFunction, Application} from 'express';
import { BadRequestError } from '../Error/BadRequestError';
import logger from '../services/Logger/logger';


export const useErrorHandles = (app: Application): void => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof BadRequestError) {
      logger.error(`BadRequest: ${err.message}`);
      res.status(err.statusCode).json({
        error: err.name,
        message: err.message,
        details: err.details,
      });
      return;
    }

    
    if (err) {
      logger.error(`Internal Error: ${err.message}`);
      res.status(500).json({
      error: 'InternalServerError',
      message: 'Something went wrong',
    })}
  });
};
