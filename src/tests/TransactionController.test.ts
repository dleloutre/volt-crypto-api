import request from 'supertest';
import { TransactionController } from '@application/controllers/transaction';
import { TransactionService } from '@application/services/TransactionService';
import { BadRequestException, InternalErrorException } from '@shared';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { TransactionResponseDTO } from '@application/DTOs';
import { TransactionType } from '@domain';
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

const app: Express = express();
app.use(bodyParser.json());

jest.mock('@application/services/TransactionService');
const mockedTransactionService = new TransactionService(
  {} as any,
  {} as any,
  {} as any,
  {} as any
) as jest.Mocked<TransactionService>;

const transactionController = new TransactionController(mockedTransactionService);
app.post('/api/buy', transactionController.buy);
app.post('/api/sell', transactionController.sell);

describe('TransactionController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('buy', () => {
    it('should return success response when transaction is successful', async () => {
      const transactionDTO = { amount: 0.001, currency: 'btc' };
      const mockedResponse: TransactionResponseDTO = { ...transactionDTO, price: 30000, currencyId: 1, type: TransactionType.BUY };

      mockedTransactionService.buy.mockResolvedValue(mockedResponse);

      const response = await request(app)
        .post('/api/buy')
        .send(transactionDTO)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockedResponse,
        statusCode: 200
      });
    });

    it('should return error response for BadRequestException', async () => {
      const transactionDTO = { amount: 0.001, currency: 'btc' };
      const errorMessage = 'Insufficient balance';

      mockedTransactionService.buy.mockRejectedValue(new BadRequestException(errorMessage));

      const response = await request(app)
        .post('/api/buy')
        .send(transactionDTO)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        data: {
          message: errorMessage,
        },
        statusCode: 400
      });
    });

    it('should return error response for InternalErrorException', async () => {
      const transactionDTO = { amount: 0.001, currency: 'btc' };
      const errorMessage = 'Internal error';

      mockedTransactionService.buy.mockRejectedValue(new InternalErrorException(errorMessage));

      const response = await request(app)
        .post('/api/buy')
        .send(transactionDTO)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        data: {
          message: errorMessage,
        },
        statusCode: 500
      });
    });
  });

  describe('sell', () => {
    it('should return success response when transaction is successful', async () => {
      const transactionDTO = { amount: 0.001, currency: 'btc' };
      const mockedResponse: TransactionResponseDTO = { ...transactionDTO, price: 30000, currencyId: 1, type: TransactionType.SELL };

      mockedTransactionService.sell.mockResolvedValue(mockedResponse);

      const response = await request(app)
        .post('/api/sell')
        .send(transactionDTO)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockedResponse,
        statusCode: 200
      });
    });

    it('should return error response for BadRequestException', async () => {
      const transactionDTO = { amount: 0.001, currency: 'btc' };
      const errorMessage = 'Insufficient balance';

      mockedTransactionService.sell.mockRejectedValue(new BadRequestException(errorMessage));

      const response = await request(app)
        .post('/api/sell')
        .send(transactionDTO)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        data: {
          message: errorMessage,
        },
        statusCode: 400
      });
    });

    it('should return error response for InternalErrorException', async () => {
      const transactionDTO = { amount: 0.001, currency: 'btc' };
      const errorMessage = 'Internal error';

      mockedTransactionService.sell.mockRejectedValue(new InternalErrorException(errorMessage));

      const response = await request(app)
        .post('/api/sell')
        .send(transactionDTO)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        data: {
          message: errorMessage,
        },
        statusCode: 500
      });
    });
  });
});
