import { CURRENCY } from '../enums/wallet.enum';

export interface WalletInterface {
  wallet_id: string;
  name: string;
  currency: CURRENCY;
  balance: number;
  book_balance: number;
  delete_flag: number;
  dormant_flag: number;
}
