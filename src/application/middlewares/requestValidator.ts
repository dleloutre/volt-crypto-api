import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export function validateRequest(type: any): RequestHandler {
  return (req, res, next) => {
    const dtoObject = plainToInstance(type, req.body);

    validate(dtoObject).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        let rawErrors: string[] = [];
        for (const errorItem of errors) {
          rawErrors = rawErrors.concat(
            ...rawErrors,
            Object.values(errorItem.constraints ?? []),
          );
        }
        res.status(StatusCodes.BAD_REQUEST).send({
          success: false,
          data: { message: JSON.stringify(rawErrors) },
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }
      req.body = dtoObject;
      next();
    });
  };
}
