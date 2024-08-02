import { Entity } from '@domain/Entity';
import { TransactionType } from '@domain/transaction/TransactionType';

export type TransactionArgs = {
  id?: number;
  amount: number;
  price: number;
  type: TransactionType;
  currencyId: number;
};

export class Transaction extends Entity {
  public amount: number;
  public price: number;
  public type: TransactionType;
  public currency_id: number;

  constructor(args: TransactionArgs) {
    super(args.id);
    this.amount = args.amount;
    this.price = args.price;
    this.type = args.type;
    this.currency_id = args.currencyId;
  }
}
