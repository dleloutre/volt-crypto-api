import { Service } from 'typedi';
import { CurrencyRepository } from '@repositories/CurrencyRepository';
import { Currency } from '@domain/currency';

@Service()
export class CurrencyService {
  constructor(public currencyRepository: CurrencyRepository) {}

  async getByName(name: string): Promise<Currency | null> {
    return await this.currencyRepository.findByName(name);
  }
}