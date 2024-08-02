import { Wallet } from './Wallet';
import { Transaction as SequelizeTransaction } from 'sequelize';

export interface IWalletRepository {
  update(wallet: Wallet, options: { transaction?: SequelizeTransaction }): Promise<void>;
  findByCurrencyId(currency: number): Promise<Wallet | null>;
}
