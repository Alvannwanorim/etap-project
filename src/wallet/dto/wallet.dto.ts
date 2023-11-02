import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CURRENCY } from '../enums/wallet.enum';

export class WalletDto {
  @IsEnum(CURRENCY)
  currency: CURRENCY;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
