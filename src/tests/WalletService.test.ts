import {
  CurrencyService,
  TransactionService,
  WalletService,
} from '@application/services';
import { config } from '@config';
import { Currency } from '@domain/currency';
import { TRANSACTION_BUY } from '@domain/transaction';
import { Wallet } from '@domain/wallet';
import { CurrencyRepository, WalletRepository } from '@repositories';
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

jest.mock('@repositories/WalletRepository');
jest.mock('@application/services/CurrencyService');
jest.mock('@repositories/CurrencyRepository');

describe('Wallet Service', () => {
  let walletService: WalletService;
  let mockedWalletRepository: jest.Mocked<WalletRepository>;
  let mockedCurrencyService: jest.Mocked<CurrencyService>;

  beforeEach(() => {
    jest.clearAllMocks();
    Container.reset();

    mockedWalletRepository =
      new WalletRepository() as jest.Mocked<WalletRepository>;
    mockedCurrencyService = new CurrencyService(
      new CurrencyRepository() as jest.Mocked<CurrencyRepository>,
    ) as jest.Mocked<CurrencyService>;

    Container.set('WalletRepositoryW', mockedWalletRepository);
    Container.set('CurrencyServiceW', mockedCurrencyService);

    walletService = new WalletService(
      Container.get('WalletRepositoryW'),
      Container.get('CurrencyServiceW'),
    );
  });

  it('returns wallet when valid currency', async () => {
    const foundCurrency = new Currency({ id: 1, name: 'btc' });
    const foundWallet = new Wallet({ balance: 0, currencyId: 1, id: 1 });

    mockedCurrencyService.getByName.mockResolvedValue(foundCurrency);
    mockedWalletRepository.findByCurrencyId.mockResolvedValue(foundWallet);

    const res = await walletService.getWalletByCurrencyName('btc');

    expect(mockedCurrencyService.getByName).toHaveBeenCalledTimes(1);
    expect(mockedWalletRepository.findByCurrencyId).toHaveBeenCalledTimes(1);
    expect(res).toBeTruthy();
  });

  it('returns null when invalid currency', async () => {
    const foundCurrency = new Currency({ name: 'btc' });
    const foundWallet = new Wallet({ balance: 0, currencyId: 1, id: 1 });

    mockedCurrencyService.getByName.mockResolvedValue(foundCurrency);
    mockedWalletRepository.findByCurrencyId.mockResolvedValue(foundWallet);

    const res = await walletService.getWalletByCurrencyName('usd');

    expect(mockedCurrencyService.getByName).toHaveBeenCalledTimes(1);
    expect(mockedWalletRepository.findByCurrencyId).not.toHaveBeenCalled();
    expect(res).toBe(null);
  });

  it('updates balances correctly for BUY transaction', async () => {
    const usdWallet: Wallet = { id: 1, balance: 1000, currency_id: 1 };
    const cryptoWallet: Wallet = { id: 2, balance: 2, currency_id: 2 };
    const cryptoAmount = 1;
    const cryptoTotalPrice = 500;

    const mockedUpdate = jest.fn();
    walletService.update = mockedUpdate;

    await walletService.updateWalletsBalance(
      usdWallet,
      cryptoWallet,
      TRANSACTION_BUY,
      cryptoAmount,
      cryptoTotalPrice,
      {},
    );

    expect(mockedUpdate).toHaveBeenCalledTimes(2);
    expect(mockedUpdate).toHaveBeenCalledWith(
      { ...usdWallet, balance: 500 },
      {},
    );
    expect(mockedUpdate).toHaveBeenCalledWith(
      { ...cryptoWallet, balance: 3 },
      {},
    );
  });

  it('updates balances correctly for SELL transaction', async () => {
    const usdWallet: Wallet = { id: 1, balance: 1000, currency_id: 1 };
    const cryptoWallet: Wallet = { id: 2, balance: 2, currency_id: 2 };
    const cryptoAmount = 1;
    const cryptoTotalPrice = 500;

    const mockedUpdate = jest.fn();
    walletService.update = mockedUpdate;

    await walletService.updateWalletsBalance(
      usdWallet,
      cryptoWallet,
      'sell',
      cryptoAmount,
      cryptoTotalPrice,
      {},
    );

    expect(mockedUpdate).toHaveBeenCalledTimes(2);
    expect(mockedUpdate).toHaveBeenCalledWith(
      { ...usdWallet, balance: 1500 },
      {},
    );
    expect(mockedUpdate).toHaveBeenCalledWith(
      { ...cryptoWallet, balance: 1 },
      {},
    );
  });
});
