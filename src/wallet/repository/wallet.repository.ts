import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from '../entity/wallet.entity';
import User from 'src/user/entity/user.entity';

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

  async transferFund(
    sender: Wallet,
    receiver: Wallet,
    amount: number,
  ): Promise<boolean> {
    return this.manager.transaction(async (transactionEntityManager) => {
      sender.balance -= amount;
      receiver.balance += amount;
      await transactionEntityManager.save(Wallet, [sender, receiver]);
      return true;
    });
  }
}
