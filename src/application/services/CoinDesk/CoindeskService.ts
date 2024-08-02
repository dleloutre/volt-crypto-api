import axios, { AxiosResponse } from 'axios';
import { config } from '@config';
import { Service } from 'typedi';
import { InternalErrorException } from '@shared/exceptions';

interface BitcoinPriceResponse {
  bpi: {
    USD: {
      rate_float: number;
    };
  };
}

@Service()
export class CoindeskService {
  readonly BITCOIN_PRICE_ENDPOINT = '/bpi/currentprice.json';

  public url(path: string) {
    return config.coindeskUrl + path;
  }

  public async getBitcoinPrice(): Promise<number> {
    try {
      const response: AxiosResponse<BitcoinPriceResponse> = await axios.get(this.url(this.BITCOIN_PRICE_ENDPOINT));
      return response.data.bpi.USD.rate_float;
    } catch (error) {
      throw new InternalErrorException(`Failed to fetch Bitcoin price: ${error.message}`);
    }
  }
}