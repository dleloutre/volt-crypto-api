export enum CurrencyName {
  BTC = 'btc',
  USD = 'usd',
}

export function getCurrencyValues(): CurrencyName[] {
  return Object.values(CurrencyName);
}

export function getCurrencyIn(param: string | undefined): CurrencyName[] {
  if (!param) return getCurrencyValues();
  return param.split(',') as CurrencyName[];
}
