import { Wallet as WalletModel } from '@db';
import { IWalletRepository, Wallet } from '@domain/wallet';
import { Op, Transaction as SequelizeTransaction } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class WalletRepository implements IWalletRepository {
  async update(
    wallet: Wallet,
    options: { transaction?: SequelizeTransaction },
  ): Promise<void> {
    await WalletModel.upsert({ ...wallet }, options);
  }

  async findByCurrencyId(currency_id: number): Promise<Wallet | null> {
    const wallet = await WalletModel.findOne({ where: { currency_id } });
    if (!wallet) return null;
    return new Wallet({
      id: wallet.id,
      balance: wallet.balance,
      currencyId: wallet.currency_id,
    });
  }
}
