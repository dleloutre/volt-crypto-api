import { Service } from 'typedi';
import connection from '@db/SequelizeClient';
import { TransactionRepository } from 'repositories';
import { Transaction, TransactionType } from '@domain/transaction';
import { CoindeskService } from '@application/services/CoinDesk/CoindeskService';
import { WalletService } from '@application/services/WalletService';
import { BadRequestException, InternalErrorException, NotFoundException } from '@shared/exceptions';
import { CurrencyName } from '@domain/currency';
import { CurrencyService } from '@application/services/CurrencyService';
import { TransactionRequestDTO, TransactionResponseDTO } from '@application/DTOs/';
import { Not } from 'sequelize-typescript';


@Service()
export class TransactionService {
  constructor(public transactionRepository: TransactionRepository,
              public coindeskService: CoindeskService,
              public walletService: WalletService,
              public currencyService: CurrencyService,
  ) {}

  public async buy(transactionDTO: TransactionRequestDTO) {
    return await this.performTransaction(transactionDTO, TransactionType.BUY);
  }

  public async sell(transactionDTO: TransactionRequestDTO) {
    return await this.performTransaction(transactionDTO, TransactionType.SELL);
  }

  private async performTransaction(
    transactionDTO: TransactionRequestDTO,
    type: TransactionType
  ) : Promise<TransactionResponseDTO> {
    try {
      return await connection.transaction(async dbTransaction => {
        const cryptoPrice = await this.coindeskService.getBitcoinPrice();
        const usdWallet = await this.walletService.getWalletByCurrencyName(CurrencyName.USD);
        const cryptoWallet = await this.walletService.getWalletByCurrencyName(transactionDTO.currency);

        if (!usdWallet || !cryptoWallet) throw new NotFoundException('Wallets not found');

        const cryptoAmount = transactionDTO.amount;
        const cryptoTotalPrice = cryptoPrice * cryptoAmount;

        if (type === TransactionType.BUY && usdWallet.balance < cryptoTotalPrice) throw new BadRequestException('Insufficient USD balance');
        if (type === TransactionType.SELL && cryptoWallet.balance < cryptoAmount) throw new BadRequestException(`Insufficient ${transactionDTO.currency} balance`);

        const newTransaction = {
          ...transactionDTO,
          price: cryptoPrice,
          currencyId: cryptoWallet.currency_id,
          type: type
        }
        await this.transactionRepository.create(
          new Transaction(newTransaction),
          { transaction: dbTransaction }
        );
        await this.walletService.updateWalletsBalance(usdWallet, cryptoWallet, type, cryptoAmount, cryptoTotalPrice, { transaction: dbTransaction });

        return newTransaction;
      });
    }
    catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalErrorException(`Could not create transaction: ${error.message}`);
    }
  }

  public async getInvestments() {
    const currency = await this.currencyService.getByName(CurrencyName.BTC);
    if (!currency?.id) throw new InternalErrorException('Currency ID not found');

    return await this.transactionRepository.findTotalInvested(currency.id);
  }
}