import { IsEnum } from 'class-validator';
import { CURRENCY } from '../enums/wallet.enum';

export class WalletDto {
  @IsEnum(CURRENCY)
  currency: CURRENCY;
}
