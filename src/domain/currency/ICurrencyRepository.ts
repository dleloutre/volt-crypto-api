import { Currency } from './Currency';

export interface ICurrencyRepository {
  findById(id: string): Promise<Currency | null>;
}
