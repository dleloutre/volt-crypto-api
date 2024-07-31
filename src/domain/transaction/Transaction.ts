import { Entity } from '@domain/Entity';
import { TransactionType } from '@domain/transaction/TransactionType';

export type TransactionArgs = {
  id?: number;
  userId: number;
  amount: number;
  price: number;
  type: TransactionType;
  currencyId: number;
};

export class Transaction extends Entity {
  public userId: number;
  public amount: number;
  public price: number;
  public type: TransactionType;
  public currencyId: number;

  constructor(args: TransactionArgs) {
    super(args.id);
    this.userId = args.userId;
    this.amount = args.amount;
    this.price = args.price;
    this.type = args.type;
    this.currencyId = args.currencyId;
  }
}
