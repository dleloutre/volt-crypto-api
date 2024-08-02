import {
  TransactionRequestDTO,
  TransactionResponseDTO,
} from '@application/DTOs';
import { CoindeskService } from '@application/services';
import { CurrencyService } from '@application/services';
import { WalletService } from '@application/services';
import connection from '@db/SequelizeClient';
import { CURRENCY_CRYPTO, CURRENCY_USD } from '@domain/currency';
import {
  Transaction,
  TRANSACTION_BUY,
  TRANSACTION_SELL,
} from '@domain/transaction';
import {
  BadRequestException,
  InternalErrorException,
  NotFoundException,
} from '@shared';
import { TransactionRepository } from 'repositories';
import { Service } from 'typedi';

@Service()
export class TransactionService {
  constructor(
    public transactionRepository: TransactionRepository,
    public coindeskService: CoindeskService,
    public walletService: WalletService,
    public currencyService: CurrencyService,
  ) {}

  public async buy(transactionDTO: TransactionRequestDTO) {
    return await this.performTransaction(transactionDTO, TRANSACTION_BUY);
  }

  public async sell(transactionDTO: TransactionRequestDTO) {
    return await this.performTransaction(transactionDTO, TRANSACTION_SELL);
  }

  private async performTransaction(
    transactionDTO: TransactionRequestDTO,
    type: string,
  ): Promise<TransactionResponseDTO> {
    try {
      return await connection.transaction(async (dbTransaction) => {
        const cryptoPrice = await this.coindeskService.getBitcoinPrice();
        const usdWallet = await this.walletService.getWalletByCurrencyName(
          CURRENCY_USD,
        );
        const cryptoWallet = await this.walletService.getWalletByCurrencyName(
          transactionDTO.currency,
        );

        if (!usdWallet || !cryptoWallet)
          throw new NotFoundException('Wallets not found');

        const cryptoAmount = transactionDTO.amount;
        const cryptoTotalPrice = cryptoPrice * cryptoAmount;

        if (type === TRANSACTION_BUY && usdWallet.balance < cryptoTotalPrice)
          throw new BadRequestException('Insufficient USD balance');
        if (type === TRANSACTION_SELL && cryptoWallet.balance < cryptoAmount)
          throw new BadRequestException(
            `Insufficient ${transactionDTO.currency} balance`,
          );

        const newTransaction = {
          ...transactionDTO,
          price: cryptoPrice,
          currencyId: cryptoWallet.currency_id,
          type: type,
        };

        await this.transactionRepository.create(
          new Transaction(newTransaction),
          { transaction: dbTransaction },
        );
        await this.walletService.updateWalletsBalance(
          usdWallet,
          cryptoWallet,
          type,
          cryptoAmount,
          cryptoTotalPrice,
          { transaction: dbTransaction },
        );

        return newTransaction;
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalErrorException(
        `Could not create transaction: ${error.message}`,
      );
    }
  }

  public async getInvestments() {
    const currency = await this.currencyService.getByName(CURRENCY_CRYPTO);
    if (!currency?.id)
      throw new InternalErrorException('Currency ID not found');

    return await this.transactionRepository.findTotalInvested(currency.id);
  }
}
