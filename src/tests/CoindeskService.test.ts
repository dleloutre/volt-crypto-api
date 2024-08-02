import { CoindeskService } from '@application/services';
import { config } from '@config';
import { InternalErrorException } from '@shared/exceptions';
import axios from 'axios';
import { Container } from 'typedi';

jest.mock('@config', () => ({
  config: {
    coindeskUrl: 'https://mocked-url.com',
  },
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CoindeskService', () => {
  let coindeskService: CoindeskService;

  beforeAll(() => {
    Container.set(CoindeskService, new CoindeskService());
    coindeskService = Container.get(CoindeskService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    coindeskService = Container.get(CoindeskService);
  });

  it('should return Bitcoin price when the request is successful', async () => {
    const mockedResponse = {
      data: {
        bpi: {
          USD: {
            rate_float: 30000,
          },
        },
      },
    };

    mockedAxios.get.mockResolvedValue(mockedResponse);

    const price = await coindeskService.getBitcoinPrice();
    expect(price).toBe(30000);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      config.coindeskUrl + '/bpi/currentprice.json',
    );
  });

  it('should throw InternalErrorException when the request fails', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    await expect(coindeskService.getBitcoinPrice()).rejects.toThrow(
      InternalErrorException,
    );
    await expect(coindeskService.getBitcoinPrice()).rejects.toThrow(
      `Failed to fetch Bitcoin price: ${errorMessage}`,
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      config.coindeskUrl + '/bpi/currentprice.json',
    );
  });
});
