import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from '../entity/wallet.entity';
import User from 'src/user/entity/user.entity';
import { CURRENCY } from '../enums/wallet.enum';
import { WalletTransferDto } from '../dto/wallet_transfer.dto';

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  constructor(dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }
  async findWallets(user: User): Promise<Wallet[]> {
    const wallets = await this.createQueryBuilder('wallets')
      .innerJoin('wallets.user', 'users')
      .select([
        'wallets.wallet_id',
        'wallets.currency',
        'wallets.balance',
        'users.first_name',
        'users.last_name',
      ])
      .where('users.id = :userId', { userId: user.id })
      .getMany();

    return wallets;
  }
  async findWalletById(wallet_id: string, currency: CURRENCY): Promise<Wallet> {
    const wallet = await this.createQueryBuilder('wallets')
      .innerJoin('wallets.user', 'users')
      .select([
        'wallets.wallet_id',
        'wallets.currency',
        'wallets.balance',
        'wallets.book_balance',
        'wallets.name',
        'users.first_name',
        'users.id',
      ])
      .where('wallets.wallet_id = :wallet_id', { wallet_id })
      .andWhere('wallets.currency = :currency', { currency })
      .getOne();

    return wallet;
  }

  async transferFund(
    walletTransferDto: WalletTransferDto,
    user: User,
  ): Promise<[boolean, Wallet, Wallet, number]> {
    return this.manager.transaction(async (transactionEntityManager) => {
      const status = walletTransferDto.amount >= 1000000 ? 0 : 1;
      const sender_wallet = await this.findWalletById(
        walletTransferDto.sender_id,
        walletTransferDto.currency,
      );
      const receiver_wallet = await this.findWalletById(
        walletTransferDto.receiver_id,
        walletTransferDto.currency,
      );
      if (!sender_wallet || !receiver_wallet) {
        throw new NotFoundException('Sender or receiver wallet not found');
      }

      if (sender_wallet.balance < walletTransferDto.amount) {
        throw new BadRequestException('Insufficient wallet balance ');
      }
      if (sender_wallet.user.id !== user.id) {
        throw new BadRequestException('Action not allowed');
      }
      sender_wallet.balance -= walletTransferDto.amount;
      sender_wallet.book_balance -= walletTransferDto.amount;
      receiver_wallet.book_balance += walletTransferDto.amount;
      receiver_wallet.balance =
        status == 1
          ? receiver_wallet.balance + walletTransferDto.amount
          : receiver_wallet.balance;
      await transactionEntityManager.save(Wallet, [
        sender_wallet,
        receiver_wallet,
      ]);
      return [true, sender_wallet, receiver_wallet, status];
    });
  }

  async updateWalletBalance(
    receiver_wallet_id: string,
    amount: number,
    currency: CURRENCY,
  ) {
    const wallet = await this.findWalletById(receiver_wallet_id, currency);
    if (!wallet) {
      throw new NotFoundException('receiver wallet not found');
    }

    wallet.balance += amount;
    await this.save(wallet);
    return wallet;
  }
}
