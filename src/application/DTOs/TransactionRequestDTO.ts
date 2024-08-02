import {
  IsEnum,
  IsNotEmpty,
  IsNumber, IsString,
} from 'class-validator';
import { CurrencyCryptoName } from '@domain/currency';
import { Transform } from 'class-transformer';

export class TransactionRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => ("" + value).toLowerCase())
  @IsEnum(CurrencyCryptoName)
  currency: string;
}