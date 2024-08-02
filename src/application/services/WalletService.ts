import { CurrencyService } from '@application/services';
import { TRANSACTION_BUY } from '@domain/transaction';
import { Wallet } from '@domain/wallet';
import { WalletRepository } from '@repositories';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class WalletService {
  constructor(
    public walletRepository: WalletRepository,
    public currencyService: CurrencyService,
  ) {}

  public async getWalletByCurrencyName(
    currencyName: string,
  ): Promise<Wallet | null> {
    const currency = await this.currencyService.getByName(currencyName);
    if (!currency?.id) return null;
    return await this.walletRepository.findByCurrencyId(currency.id);
  }

  public async update(
    wallet: Wallet,
    options: { transaction?: SequelizeTransaction },
  ) {
    await this.walletRepository.update(wallet, options);
  }

  public async updateWalletsBalance(
    usdWallet: Wallet,
    cryptoWallet: Wallet,
    type: string,
    cryptoAmount: number,
    cryptoTotalPrice: number,
    options: { transaction?: SequelizeTransaction },
  ) {
    const updatedUsdWallet = {
      ...usdWallet,
      balance:
        type === TRANSACTION_BUY
          ? usdWallet.balance - cryptoTotalPrice
          : usdWallet.balance + cryptoTotalPrice,
    };

    const updatedCryptoWallet = {
      ...cryptoWallet,
      balance:
        type === TRANSACTION_BUY
          ? cryptoWallet.balance + cryptoAmount
          : cryptoWallet.balance - cryptoAmount,
    };

    await this.update(updatedUsdWallet, options);
    await this.update(updatedCryptoWallet, options);
  }
}
