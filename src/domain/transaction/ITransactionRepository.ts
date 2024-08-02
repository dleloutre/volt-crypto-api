import { Transaction } from './Transaction';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { Transaction as TransactionModel } from '@db';

export interface ITransactionRepository {
  create(transaction: Transaction, options: { transaction?: SequelizeTransaction }): Promise<[TransactionModel, boolean | null]>;
  findTotalInvested(currencyId: number): void;
}
