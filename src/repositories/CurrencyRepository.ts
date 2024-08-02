import { Currency as CurrencyModel } from '@db';
import { Currency, CurrencyName, ICurrencyRepository } from '@domain/currency';
import { Service } from 'typedi';

@Service()
export class CurrencyRepository implements ICurrencyRepository {
  async findByName(name: string): Promise<Currency | null> {
    const currency = await CurrencyModel.findOne({ where: { name } });
    if (!currency) return null;
    return new Currency({
      id: currency.id,
      name: currency.name as CurrencyName,
    });
  }
}
