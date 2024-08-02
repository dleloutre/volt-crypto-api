import 'reflect-metadata';

import { TransactionRequestDTO } from '@application/DTOs';
import {
  CoindeskService,
  CurrencyService,
  TransactionService,
  WalletService,
} from '@application/services';
import { CURRENCY_CRYPTO, CURRENCY_USD } from '@domain/currency';
import { TRANSACTION_BUY } from '@domain/transaction';
import { Wallet } from '@domain/wallet';
import {
  CurrencyRepository,
  TransactionRepository,
  WalletRepository,
} from '@repositories';
import {
  BadRequestException,
  InternalErrorException,
  NotFoundException,
} from '@shared/exceptions';
import { anything } from 'ts-mockito';
import { Container } from 'typedi';
import { config } from '@config';

jest.mock('@config', () => ({
  config: {
    dbUrl: 'test',
    dbHost: 'test',
    dbUser: 'test',
    dbPassword: 'test',
    dbName: 'test',
    coindeskUrl: 'https://mocked-url.com',
  },
}));

jest.mock('@db/SequelizeClient', () => ({
  transaction: jest.fn().mockImplementation((callback) => {
    return callback(jest.fn());
  }),
}));
jest.mock('@repositories/TransactionRepository');
jest.mock('@application/services/CoinDesk/CoindeskService');
jest.mock('@repositories/WalletRepository');
jest.mock('@repositories/CurrencyRepository');
jest.mock('@application/services/CurrencyService');
jest.mock('@application/services/WalletService');

describe('Transaction Service', () => {
  let transactionService: TransactionService;
  let mockedTransactionRepository: jest.Mocked<TransactionRepository>;
  let mockedCoindeskService: jest.Mocked<CoindeskService>;
  let mockedWalletRepository: jest.Mocked<WalletRepository>;
  let mockedCurrencyRepository: jest.Mocked<CurrencyRepository>;
  let mockedCurrencyService: jest.Mocked<CurrencyService>;
  let mockedWalletService: jest.Mocked<WalletService>;

  beforeEach(() => {
    jest.clearAllMocks();
    Container.reset();

    mockedTransactionRepository =
      new TransactionRepository() as jest.Mocked<TransactionRepository>;
    mockedCoindeskService =
      new CoindeskService() as jest.Mocked<CoindeskService>;
    mockedWalletRepository =
      new WalletRepository() as jest.Mocked<WalletRepository>;
    mockedCurrencyRepository =
      new CurrencyRepository() as jest.Mocked<CurrencyRepository>;
    mockedCurrencyService = new CurrencyService(
      mockedCurrencyRepository,
    ) as jest.Mocked<CurrencyService>;
    mockedWalletService = new WalletService(
      mockedWalletRepository,
      mockedCurrencyService,
    ) as jest.Mocked<WalletService>;

    Container.set('TransactionRepositoryT', mockedTransactionRepository);
    Container.set('CoindeskServiceT', mockedCoindeskService);
    Container.set('WalletServiceT', mockedWalletService);
    Container.set('CurrencyServiceT', mockedCurrencyService);

    transactionService = new TransactionService(
      Container.get('TransactionRepositoryT'),
      Container.get('CoindeskServiceT'),
      Container.get('WalletServiceT'),
      Container.get('CurrencyServiceT'),
    );
  });

  it('should perform a buy transaction successfully', async () => {
    const transactionDTO: TransactionRequestDTO = {
      amount: 0.001,
      currency: 'btc',
    };
    const cryptoPrice = 30000;
    const usdWallet: Wallet = { balance: 100000, currency_id: 1, id: 1 };
    const cryptoWallet: Wallet = { balance: 1, currency_id: 2, id: 2 };
    mockedCoindeskService.getBitcoinPrice.mockResolvedValue(cryptoPrice);
    mockedWalletService.getWalletByCurrencyName.mockImplementation(
      (name: string) => {
        if (name === CURRENCY_USD) return Promise.resolve(usdWallet);
        if (name === CURRENCY_CRYPTO) return Promise.resolve(cryptoWallet);
        return Promise.resolve(null);
      },
    );
    mockedTransactionRepository.create.mockResolvedValue(anything());
    mockedWalletService.updateWalletsBalance.mockResolvedValue(anything());

    const result = await transactionService.buy(transactionDTO);

    expect(result).toEqual({
      ...transactionDTO,
      price: cryptoPrice,
      currencyId: cryptoWallet.currency_id,
      type: TRANSACTION_BUY,
    });
    expect(mockedCoindeskService.getBitcoinPrice).toHaveBeenCalledTimes(1);
    expect(mockedWalletService.getWalletByCurrencyName).toHaveBeenCalledTimes(
      2,
    );
    expect(mockedTransactionRepository.create).toHaveBeenCalledTimes(1);
    expect(mockedWalletService.updateWalletsBalance).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException if wallets are not found', async () => {
    const transactionDTO: TransactionRequestDTO = {
      amount: 0.001,
      currency: 'btc',
    };

    mockedCoindeskService.getBitcoinPrice.mockResolvedValue(30000);
    mockedWalletService.getWalletByCurrencyName.mockResolvedValue(null);

    await expect(transactionService.buy(transactionDTO)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockedCoindeskService.getBitcoinPrice).toHaveBeenCalledTimes(1);
    expect(mockedWalletService.getWalletByCurrencyName).toHaveBeenCalledTimes(
      2,
    );
  });

  it('should throw BadRequestException for insufficient USD balance during buy', async () => {
    const transactionDTO: TransactionRequestDTO = {
      amount: 0.001,
      currency: 'btc',
    };
    const cryptoPrice = 30000;
    const usdWallet = { balance: 0, currency_id: 1, id: 1 };
    const cryptoWallet = { balance: 1, currency_id: 2, id: 2 };

    mockedCoindeskService.getBitcoinPrice.mockResolvedValue(cryptoPrice);
    mockedWalletService.getWalletByCurrencyName.mockImplementation(
      (name: string) => {
        if (name === 'usd') return Promise.resolve(usdWallet);
        if (name === 'btc') return Promise.resolve(cryptoWallet);
        return Promise.resolve(null);
      },
    );

    await expect(transactionService.buy(transactionDTO)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockedCoindeskService.getBitcoinPrice).toHaveBeenCalledTimes(1);
    expect(mockedWalletService.getWalletByCurrencyName).toHaveBeenCalledTimes(
      2,
    );
  });

  it('should throw BadRequestException for insufficient crypto balance during sell', async () => {
    const transactionDTO: TransactionRequestDTO = {
      amount: 0.001,
      currency: 'btc',
    };
    const cryptoPrice = 30000;
    const usdWallet = { balance: 100000, currency_id: 1, id: 1 };
    const cryptoWallet = { balance: 0, currency_id: 2, id: 2 };

    mockedCoindeskService.getBitcoinPrice.mockResolvedValue(cryptoPrice);
    mockedWalletService.getWalletByCurrencyName.mockImplementation(
      (name: string) => {
        if (name === 'usd') return Promise.resolve(usdWallet);
        if (name === 'btc') return Promise.resolve(cryptoWallet);
        return Promise.resolve(null);
      },
    );

    await expect(transactionService.sell(transactionDTO)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockedCoindeskService.getBitcoinPrice).toHaveBeenCalledTimes(1);
    expect(mockedWalletService.getWalletByCurrencyName).toHaveBeenCalledTimes(
      2,
    );
  });

  it('should return investments successfully', async () => {
    const currency = { id: 1, name: 'btc' };
    const totalInvested = 50000;

    mockedCurrencyService.getByName.mockResolvedValue(currency);
    mockedTransactionRepository.findTotalInvested.mockResolvedValue(
      totalInvested as any,
    );

    const result = await transactionService.getInvestments();

    expect(result).toBe(totalInvested);
    expect(mockedCurrencyService.getByName).toHaveBeenCalledWith('btc');
    expect(mockedTransactionRepository.findTotalInvested).toHaveBeenCalledWith(
      currency.id,
    );
  });

  it('should throw InternalErrorException when currency ID is not found', async () => {
    mockedCurrencyService.getByName.mockResolvedValue(null);

    await expect(transactionService.getInvestments()).rejects.toThrow(
      InternalErrorException,
    );
    expect(mockedCurrencyService.getByName).toHaveBeenCalledWith(
      CURRENCY_CRYPTO,
    );
  });
});
