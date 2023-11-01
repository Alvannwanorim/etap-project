import { TRANSACTION_TYPE } from '../enums/transaction_type.enum';

export interface TransactionHistoryInterface {
  id: number;
  amount: number;
  transaction_type: TRANSACTION_TYPE;
  receiver_wallet_id: string;
  sender_wallet_id: string;
  status: number;
}
