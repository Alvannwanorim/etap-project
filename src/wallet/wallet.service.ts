import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wallet } from './entity/wallet.entity';
import User from 'src/user/entity/user.entity';

import { WalletRepository } from './repository/wallet.repository';
import { WalletTransferDto } from './dto/wallet_transfer.dto';
import { TransactionHistoryService } from 'src/transaction-history/transaction-history.service';
import { TRANSACTION_TYPE } from 'src/transaction-history/enums/transaction_type.enum';
import { CURRENCY } from './enums/wallet.enum';
import { WalletDto } from './dto/wallet.dto';
import { TransactionHistory } from 'src/transaction-history/entity/transaction-history.entity';
import { FundWalletDto } from './dto/fund_wallet.dto';
import axios from 'axios';

@Injectable()
export class WalletService {
  constructor(
    private walletRepository: WalletRepository,
    private transactionHistoryService: TransactionHistoryService,
  ) {}

  /**
   * @description fetches and returns user `WALLET` from the database
   * @param wallet_id: string
   * @param currency: `CURRENCY`
   * @returns `WALLET` | null
   */
  async getWalletById(wallet_id: string, currency: CURRENCY) {
    return await this.walletRepository.findWalletById(wallet_id, currency);
  }

  /**
   * @description creates and return new user wallet
   * @param user: User
   * @returns Wallet
   */
  public async createWallet(user: User, walletDto: WalletDto): Promise<Wallet> {
    const wallet_id = user.username.slice(-10);
    const existingWallet = await this.getWalletById(
      wallet_id,
      walletDto.currency,
    );
    if (existingWallet) {
      return existingWallet;
    }

    const wallet = this.walletRepository.create({
      wallet_id,
      user,
      currency: walletDto.currency,
      name: walletDto.name,
    });
    const newWallet = this.walletRepository.save(wallet);
    return newWallet;
  }

  /**
   * @description fetches and return user wallet details
   * @param user: `User`
   * @returns `Wallet[]` | []
   */
  public async getUserWallets(user: User): Promise<Wallet[]> {
    const wallet = await this.walletRepository.findWallets(user);
    return wallet;
  }

  /**
   * @description Transfer fund from one wallet to another
   * @param walletTransferDto: WalletTransferDto
   * @param user: User
   * @returns string | Error
   */
  async transferFundToWallet(
    walletTransferDto: WalletTransferDto,
    user: User,
  ): Promise<object> {
    const [isTransferred, sender_wallet, receiver_wallet, status] =
      await this.walletRepository.transferFund(walletTransferDto, user);

    if (!isTransferred) {
      throw new BadRequestException('Transfer failed');
    }
    this.transactionHistoryService.createTransactionHistory({
      amount: walletTransferDto.amount,
      sender_wallet_id: sender_wallet.wallet_id,
      receiver_wallet_id: receiver_wallet.wallet_id,
      transaction_type: TRANSACTION_TYPE.TRANSFER,
      user: sender_wallet.user,
      currency: walletTransferDto.currency,
      status,
    });
    return {
      message: 'transfer successful',
      status: true,
      amount: walletTransferDto.amount,
      sender: walletTransferDto.sender_id,
      receiver: walletTransferDto.receiver_id,
    };
  }

  /**
   * @description retrieves all pending transactions
   * @returns TransactionHistory
   */
  async getPendingTransaction(): Promise<TransactionHistory[]> {
    return await this.transactionHistoryService.getPendingTransaction();
  }

  /**
   * @description approves the pending transaction
   * @throws Error is the transaction has been approved
   * @param transaction_id: string
   * @returns: Object
   */
  async approvePendingTransaction(transaction_id: number) {
    const transaction =
      await this.transactionHistoryService.getAndApproveTransactionById(
        transaction_id,
      );

    if (!transaction) throw new NotFoundException('Transaction not found');

    const wallet = await this.walletRepository.updateWalletBalance(
      transaction.receiver_wallet_id,
      transaction.amount,
      transaction.currency,
    );
    return wallet;
  }

  /**
   * @description validate transfer details and adds fun to wallet book balance.
   * @param fundWalletDto
   * @param user
   * @returns Wallet
   */
  async fundWallet(fundWalletDto: FundWalletDto, user: User) {
    const wallet = await this.getWalletById(
      fundWalletDto.wallet_id,
      fundWalletDto.currency,
    );
    if (!wallet) throw new BadRequestException('wallet not found');
    const transactionDetails = await this.getUserTransactionDetailsById(
      fundWalletDto.transaction_id,
    );
    if (!transactionDetails)
      throw new BadRequestException('Error funding wallet');

    if (transactionDetails && transactionDetails.status === true) {
      wallet.book_balance += fundWalletDto.amount;
      await this.walletRepository.save(wallet);

      await this.transactionHistoryService.createTransactionHistory({
        amount: fundWalletDto.amount,
        transaction_type: TRANSACTION_TYPE.FUNDING,
        receiver_wallet_id: fundWalletDto.wallet_id,
        sender_wallet_id: transactionDetails.data.id,
        status: 0,
        currency: fundWalletDto.currency,
        user,
      });
      return {
        message: 'transfer successful',
        status: true,
        amount: fundWalletDto.amount,
        receiver: fundWalletDto.wallet_id,
      };
    }
    throw new BadRequestException('Error funding wallet');
  }

  async getUserTransactionDetailsById(transaction_id: string) {
    const url = `${process.env.PAYSTACK_PAYMENT_API}/transaction/${transaction_id}`;
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
        },
      });
      return data;
    } catch (err) {
      return null;
    }
  }
}
