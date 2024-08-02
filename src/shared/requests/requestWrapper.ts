import { NextFunction, Request, Response } from 'express';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const requestWrapper = (handler: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  };
};
