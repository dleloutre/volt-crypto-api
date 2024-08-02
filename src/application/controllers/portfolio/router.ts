import { Router } from 'express';
import { Container } from 'typedi';

import { PortfolioController } from './PortfolioController';

export function PortfolioRouter() {
  const router = Router();
  const portfolioController = Container.get(PortfolioController);

  router.get('/', portfolioController.show);

  return router;
}
