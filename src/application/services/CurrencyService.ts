import { Currency } from '@domain/currency';
import { CurrencyRepository } from '@repositories/CurrencyRepository';
import { Service } from 'typedi';

@Service()
export class CurrencyService {
  constructor(public currencyRepository: CurrencyRepository) {}

  async getByName(name: string): Promise<Currency | null> {
    return await this.currencyRepository.findByName(name);
  }
}
