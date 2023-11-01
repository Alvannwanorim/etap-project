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
    return await this.walletRepository.findOne({
      where: { wallet_id, currency },
    });
  }

  /**
   * @description creates and return new user wallet
   * @param user: User
   * @returns Wallet
   */
  public async createWallet(user: User, currency: CURRENCY): Promise<Wallet> {
    const wallet_id = user.username.slice(-10);
    const existingWallet = await this.getWalletById(wallet_id, currency);
    if (existingWallet) {
      return existingWallet;
    }

    const wallet = this.walletRepository.create({ wallet_id, user, currency });
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
  ): Promise<string> {
    const sender_wallet = await this.getWalletById(
      walletTransferDto.sender_id,
      walletTransferDto.currency,
    );
    const receiver_wallet = await this.getWalletById(
      walletTransferDto.receiver_id,
      walletTransferDto.currency,
    );
    if (!sender_wallet || !receiver_wallet) {
      throw new NotFoundException('Sender or receiver wallet not found');
    }

    if (sender_wallet.balance < walletTransferDto.amount) {
      throw new Error('Insufficient wallet balance ');
    }

    if (sender_wallet.user !== user) {
      throw new BadRequestException('Action not allowed');
    }

    const isTransferred = await this.walletRepository.transferFund(
      sender_wallet,
      receiver_wallet,
      walletTransferDto.amount,
    );

    if (!isTransferred) {
      throw new BadRequestException('Transfer failed');
    }
    this.transactionHistoryService.createTransactionHistory({
      amount: walletTransferDto.amount,
      sender_wallet_id: sender_wallet.wallet_id,
      receiver_wallet_id: receiver_wallet.wallet_id,
      transaction_type: TRANSACTION_TYPE.TRANSFER,
      user: sender_wallet.user,
    });
    return 'transfer successful';
  }
}
