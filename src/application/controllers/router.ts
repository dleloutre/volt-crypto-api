import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TransactionRouter } from './transaction';
import { PortfolioRouter } from './portfolio';

export function registerRouters(app: Express) {
  app.get('/health', (_, res) => res.status(StatusCodes.OK).send());
  app.use('/api', TransactionRouter());
  app.use('/api/portfolio', PortfolioRouter());
}
