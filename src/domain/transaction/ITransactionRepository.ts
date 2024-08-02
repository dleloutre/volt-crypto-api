import { Transaction as TransactionModel } from '@db';
import { Transaction as SequelizeTransaction } from 'sequelize';

import { Transaction } from './Transaction';

export interface ITransactionRepository {
  create(
    transaction: Transaction,
    options: { transaction?: SequelizeTransaction },
  ): Promise<TransactionModel>;
  findTotalInvested(currencyId: number): void;
}
