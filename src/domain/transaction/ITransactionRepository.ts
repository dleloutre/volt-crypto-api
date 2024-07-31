import { Transaction } from './Transaction';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<void>;
  findByUserId(userId: number): Promise<Transaction[]>;
  search(query: string): Promise<Transaction[]>;
}