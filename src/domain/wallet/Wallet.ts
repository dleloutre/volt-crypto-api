import { Entity } from '@domain';

export type WalletArgs = {
  id?: number;
  currencyId: number;
  balance: number;
};

export class Wallet extends Entity {
  public currency_id: number;
  public balance: number;

  constructor(args: WalletArgs) {
    super(args.id);
    this.currency_id = args.currencyId;
    this.balance = args.balance;
  }
}
