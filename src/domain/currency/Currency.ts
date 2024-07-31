import { CurrencyName } from '@domain/currency/CurrencyName';
import { Entity } from '@domain/Entity';

export type CurrencyArgs = {
  id?: number;
  name: CurrencyName;
};

export class Currency extends Entity {
  public name: CurrencyName;

  constructor(args: CurrencyArgs) {
    super(args.id);
    this.name = args.name;
  }
}
