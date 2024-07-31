import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';

//import { AuthRouter } from './auth';

export function registerRouters(app: Express) {
  app.get('/health', (_, res) => res.status(StatusCodes.OK).send());
  // app.use('/auth', AuthRouter());
}
