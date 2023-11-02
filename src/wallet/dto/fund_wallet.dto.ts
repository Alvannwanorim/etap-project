import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CURRENCY } from '../enums/wallet.enum';

export class FundWalletDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsEnum(CURRENCY)
  currency: CURRENCY;

  @IsString()
  @IsNotEmpty()
  wallet_id: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
