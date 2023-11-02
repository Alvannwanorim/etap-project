import { Optional } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';
import { CURRENCY } from '../enums/wallet.enum';
import { TRANSACTION_TYPE } from 'src/transaction-history/enums/transaction_type.enum';

export class WalletTransferDto {
  @Optional()
  sender_id: string;

  @IsString()
  @IsNotEmpty()
  receiver_id: string;

  @IsNotEmpty()
  @Min(100)
  amount: number;

  @IsEnum(CURRENCY)
  currency: CURRENCY;

  @IsEnum(TRANSACTION_TYPE)
  transaction_type: TRANSACTION_TYPE;
}
