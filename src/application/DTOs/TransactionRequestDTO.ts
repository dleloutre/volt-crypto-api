import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  currency: string;
}
