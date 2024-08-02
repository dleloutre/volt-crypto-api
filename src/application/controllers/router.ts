import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';

import { PortfolioRouter } from './portfolio';
import { TransactionRouter } from './transaction';

export function registerRouters(app: Express) {
  app.get('/health', (_, res) => res.status(StatusCodes.OK).send());
  app.use('/api', TransactionRouter());
  app.use('/api/portfolio', PortfolioRouter());
}
