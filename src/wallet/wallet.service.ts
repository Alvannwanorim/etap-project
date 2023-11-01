import { Injectable } from '@nestjs/common';
import { Wallet } from './entity/wallet.entity';
import User from 'src/user/entity/user.entity';

import { WalletRepository } from './repository/wallet.repository';

@Injectable()
export class WalletService {
  constructor(private walletRepository: WalletRepository) {}

  /**
   * @description generates random 3 digit values
   * @returns random 3 digits
   */
  private generateRandom3Digits(): string {
    const min = 1e2;
    const max = 1e3 - 1;
    return Math.floor(Math.random() * (max - min) + min).toString();
  }

  /**
   * @description this is used to generate new wallet id for a user
   * @param phone_number: string
   * @returns unique wallet id
   */
  private async generateUniqueWalletId(phone_number: string): Promise<string> {
    const last10Digit = phone_number.slice(-10);
    let uniqueWalletId: string;
    let isUnique = false;

    while (!isUnique) {
      const random3Digits = this.generateRandom3Digits();
      uniqueWalletId = last10Digit + random3Digits;

      const existingWallet = await this.walletRepository.findOne({
        where: { wallet_id: uniqueWalletId },
      });
      if (!existingWallet) {
        isUnique = true;
      }
    }
    return uniqueWalletId;
  }

  /**
   * @description creates and return new user wallet
   * @param user: User
   * @returns Wallet
   */
  public async createWallet(user: User): Promise<Wallet> {
    const wallet_id = await this.generateUniqueWalletId(user.username);

    const wallet = this.walletRepository.create({ wallet_id, user });
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
}
