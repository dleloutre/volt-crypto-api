import { Service } from 'typedi';
import { Currency, CurrencyName, ICurrencyRepository } from '@domain/currency';
import { Currency as CurrencyModel } from '@db';


@Service()
export class CurrencyRepository implements ICurrencyRepository {
  async findByName(name: string): Promise<Currency | null> {
    const currency = await CurrencyModel.findOne({where: {name}});
    if (!currency) return null
    return new Currency({
      id: currency.id,
      name: currency.name as CurrencyName,
    })
  }
}