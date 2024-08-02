import { Service } from 'typedi';
import { ITransactionRepository, Transaction, TransactionType } from '@domain/transaction';
import { Transaction as TransactionModel} from '../db';
import { Transaction as SequelizeTransaction } from 'sequelize';
import connection from '@db/SequelizeClient';

@Service()
export class TransactionRepository implements ITransactionRepository {

  async create(transaction: Transaction, options: { transaction?: SequelizeTransaction }): Promise<[TransactionModel, boolean | null]> {
    const { id, ...transactionWithoutId } = transaction;
    return await TransactionModel.upsert({
      ...transactionWithoutId
    }, options);
  }

  findTotalInvested(currencyId: number) {
    return TransactionModel.findAll({
      attributes: [
        [connection.fn('SUM', connection.literal('amount * price')), 'totalInvestment']
      ],
      where: {
        type: TransactionType.BUY,
        currency_id: currencyId
      }
    });
  }
}