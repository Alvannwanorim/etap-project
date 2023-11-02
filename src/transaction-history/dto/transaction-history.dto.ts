import { CURRENCY } from 'src/wallet/enums/wallet.enum';
import { TRANSACTION_TYPE } from '../enums/transaction_type.enum';
import User from 'src/user/entity/user.entity';

export class TransactionHistoryDto {
  amount: number;
  transaction_type: TRANSACTION_TYPE;
  receiver_wallet_id: string;
  sender_wallet_id?: string;
  status?: number;
  currency: CURRENCY;
  user: User;
}
