import { Wallet } from './Wallet';

export interface IWalletRepository {
  update(wallet: Wallet, walletId: string): Promise<void>;
  findById(id: string): Promise<Wallet | null>;
}