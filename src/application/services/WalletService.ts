import { Service } from 'typedi';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { WalletRepository } from '@repositories';
import { Wallet } from '@domain/wallet';
import { TransactionType } from '@domain/transaction';
import { CurrencyService } from '@application/services/CurrencyService';


@Service()
export class WalletService {
  constructor(public walletRepository: WalletRepository, public currencyService: CurrencyService) {}

  public async getWalletByCurrencyName(currencyName: string): Promise<Wallet | null> {
    const currency = await this.currencyService.getByName(currencyName);
    if (!currency?.id) return null;
    return await this.walletRepository.findByCurrencyId(currency.id);
  }

  public async update(wallet: Wallet, options: { transaction?: SequelizeTransaction }) {
    await this.walletRepository.update(wallet, options);
  }

  public async updateWalletsBalance(
    usdWallet: Wallet,
    cryptoWallet: Wallet,
    type: TransactionType,
    cryptoAmount: number,
    cryptoTotalPrice: number,
    options: { transaction?: SequelizeTransaction }
  ) {
    const updatedUsdWallet = {
      ...usdWallet,
      balance: type === TransactionType.BUY ? usdWallet.balance - cryptoTotalPrice : usdWallet.balance + cryptoTotalPrice,
    };

    const updatedCryptoWallet = {
      ...cryptoWallet,
      balance: type === TransactionType.BUY ? cryptoWallet.balance + cryptoAmount : cryptoWallet.balance - cryptoAmount,
    };

    await this.update(updatedUsdWallet, options);
    await this.update(updatedCryptoWallet, options);
  }
}