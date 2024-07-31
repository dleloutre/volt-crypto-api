export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
}

export function getTransactionTypeValues(): TransactionType[] {
  return Object.values(TransactionType);
}

export function getTransactionTypeIn(
  param: string | undefined,
): TransactionType[] {
  if (!param) return getTransactionTypeValues();
  return param.split(',') as TransactionType[];
}
