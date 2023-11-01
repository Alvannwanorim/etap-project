import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString, Min } from 'class-validator';
import { CURRENCY } from '../enums/wallet.enum';

export class WalletTransferDto {
  @Optional()
  sender_id: string;

  @IsString()
  @IsNotEmpty()
  receiver_id: string;

  @IsNotEmpty()
  @Min(100)
  amount: number;

  currency: CURRENCY;
}
