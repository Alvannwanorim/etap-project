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
        'wallets.balance',
        'users.first_name',
        'users.last_name',
      ])
      .where('users.id = :userId', { userId: user.id })
      .getMany();

    return wallets;
  }
}
