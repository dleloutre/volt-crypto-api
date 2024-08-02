import connection from '@db/SequelizeClient';
import {
  ITransactionRepository,
  Transaction, TRANSACTION_BUY,
} from '@domain/transaction';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { Service } from 'typedi';

import { Transaction as TransactionModel } from '../db';

@Service()
export class TransactionRepository implements ITransactionRepository {
  async create(
    transaction: Transaction,
    options: { transaction?: SequelizeTransaction },
  ): Promise<TransactionModel> {
    const { id, ...transactionWithoutId } = transaction;
    return await TransactionModel.create(
      {
        ...transactionWithoutId,
      },
      options,
    );
  }

  findTotalInvested(currencyId: number) {
    return TransactionModel.findAll({
      attributes: [
        [
          connection.fn('SUM', connection.literal('amount * price')),
          'totalInvestment',
        ],
      ],
      where: {
        type: TRANSACTION_BUY,
        currency_id: currencyId,
      },
    });
  }
}
