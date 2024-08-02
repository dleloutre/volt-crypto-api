import { Entity } from '@domain/Entity';

export const TRANSACTION_BUY = 'buy';
export const TRANSACTION_SELL = 'sell';

export type TransactionArgs = {
  id?: number;
  amount: number;
  price: number;
  type: string;
  currencyId: number;
};

export class Transaction extends Entity {
  public amount: number;
  public price: number;
  public type: string;
  public currency_id: number;

  constructor(args: TransactionArgs) {
    super(args.id);
    this.amount = args.amount;
    this.price = args.price;
    this.type = args.type;
    this.currency_id = args.currencyId;
  }
}
