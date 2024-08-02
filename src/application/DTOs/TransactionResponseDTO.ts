import { TransactionType } from '@domain/transaction';

export type TransactionResponseDTO = {
  amount: number;
  currency: string;
  price: number;
  currencyId: number;
  type: TransactionType;
};