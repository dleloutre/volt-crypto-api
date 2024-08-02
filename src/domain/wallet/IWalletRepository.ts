import { Transaction as SequelizeTransaction } from 'sequelize';

import { Wallet } from './Wallet';

export interface IWalletRepository {
  update(
    wallet: Wallet,
    options: { transaction?: SequelizeTransaction },
  ): Promise<void>;
  findByCurrencyId(currency: number): Promise<Wallet | null>;
}
