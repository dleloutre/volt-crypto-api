import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import pinoLogger from 'pino';

import {
  BadRequestException,
  InternalErrorException,
  NotFoundException,
} from '../../exceptions/';

const logger = pinoLogger();

export function handleError(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  let code: number;
  let description: string;

  if (error instanceof BadRequestException) {
    //SyntaxError
    code = StatusCodes.BAD_REQUEST;
    description = 'Invalid body format';
  } else if (error instanceof NotFoundException) {
    code = StatusCodes.NOT_FOUND;
    description = 'Not found';
  } else if (error instanceof InternalErrorException) {
    code = StatusCodes.INTERNAL_SERVER_ERROR;
    description = 'Internal server error';
  } else {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: `Internal server error: ${error.message}`,
    });
    return;
  }

  res.status(code).json({
    success: false,
    error: error.message,
    statusCode: code,
    description,
  });
}
