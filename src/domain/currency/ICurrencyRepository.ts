import { Currency } from './Currency';

export interface ICurrencyRepository {
  findByName(name: string): Promise<Currency | null>;
}
