import 'reflect-metadata';

import { TransactionRequestDTO } from '@application/DTOs';
import {
  CoindeskService,
  CurrencyService,
  TransactionService,
  WalletService,
} from '@application/services';
import { config } from '@config';
import { CurrencyName, Transaction, TransactionType } from '@domain';
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

jest.mock('@repositories/TransactionRepository');
jest.mock('@repositories/WalletRepository');
jest.mock('@repositories/CurrencyRepository');
jest.mock('@application/services/CoinDesk/CoindeskService');
jest.mock('@application/services/WalletService');
jest.mock('@application/services/CurrencyService');
jest.mock('@db/SequelizeClient', () => ({
  transaction: jest.fn().mockImplementation((callback) => {
    return callback(jest.fn());
  }),
}));

const mockedTransactionRepository =
  new TransactionRepository() as jest.Mocked<TransactionRepository>;
const mockedCoindeskService =
  new CoindeskService() as jest.Mocked<CoindeskService>;
const mockedCurrencyRepository =
  new CurrencyRepository() as jest.Mocked<CurrencyRepository>;
const mockedCurrencyService = new CurrencyService(
  mockedCurrencyRepository,
) as jest.Mocked<CurrencyService>;
const mockedWalletRepository =
  new WalletRepository() as jest.Mocked<WalletRepository>;
const mockedWalletService = new WalletService(
  mockedWalletRepository,
  mockedCurrencyService,
) as jest.Mocked<WalletService>;

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    jest.clearAllMocks();
    Container.reset();

    Container.set(TransactionRepository, mockedTransactionRepository);
    Container.set(CoindeskService, mockedCoindeskService);
    Container.set(WalletService, mockedWalletService);
    Container.set(CurrencyService, mockedCurrencyService);

    transactionService = Container.get(TransactionService);
  });

  it('should perform a buy transaction successfully', async () => {
    const transactionDTO: TransactionRequestDTO = {
      amount: 0.001,
      currency: 'btc',
    };
    const cryptoPrice = 30000;
    const usdWallet = { balance: 100000, currency_id: 1, id: 1 };
    const cryptoWallet = { balance: 1, currency_id: 2, id: 2 };

    mockedCoindeskService.getBitcoinPrice.mockResolvedValue(cryptoPrice);
    mockedWalletService.getWalletByCurrencyName.mockImplementation(
      (name: string) => {
        if (name === CurrencyName.USD) return Promise.resolve(usdWallet);
        if (name === 'btc') return Promise.resolve(cryptoWallet);
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
      type: TransactionType.BUY,
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
        if (name === CurrencyName.USD) return Promise.resolve(usdWallet);
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
        if (name === CurrencyName.USD) return Promise.resolve(usdWallet);
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
    const currency = { id: 1, name: CurrencyName.BTC };
    const totalInvested = 50000;

    mockedCurrencyService.getByName.mockResolvedValue(currency);
    mockedTransactionRepository.findTotalInvested.mockResolvedValue(
      totalInvested as any,
    );

    const result = await transactionService.getInvestments();

    expect(result).toBe(totalInvested);
    expect(mockedCurrencyService.getByName).toHaveBeenCalledWith(
      CurrencyName.BTC,
    );
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
      CurrencyName.BTC,
    );
  });
});
