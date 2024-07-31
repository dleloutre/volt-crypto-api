import { Entity } from '@domain/Entity';

export type WalletArgs = {
  id?: number;
  userId: number;
  currencyId: number;
  balance: number;
};

export class Wallet extends Entity {
  public userId: number;
  public currencyId: number;
  public balance: number;

  constructor(args: WalletArgs) {
    super(args.id);
    this.userId = args.userId;
    this.currencyId = args.currencyId;
    this.balance = args.balance;
  }
}
