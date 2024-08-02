import { Entity } from '@domain';

export const CURRENCY_USD = 'usd';
export const CURRENCY_CRYPTO = 'btc';

export type CurrencyArgs = {
  id?: number;
  name: string;
};

export class Currency extends Entity {
  public name: string;

  constructor(args: CurrencyArgs) {
    super(args.id);
    this.name = args.name;
  }
}
