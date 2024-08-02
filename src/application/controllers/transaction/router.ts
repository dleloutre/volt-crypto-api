import { TransactionRequestDTO } from '@application/DTOs/TransactionRequestDTO';
import { validateRequest } from '@application/middlewares/requestValidator';
import { Router } from 'express';
import { Container } from 'typedi';

import { TransactionController } from './TransactionController';

export function TransactionRouter() {
  const router = Router();
  const transactionController = Container.get(TransactionController);

  router.post(
    '/buy',
    validateRequest(TransactionRequestDTO),
    transactionController.buy,
  );

  router.post(
    '/sell',
    validateRequest(TransactionRequestDTO),
    transactionController.sell,
  );

  return router;
}
