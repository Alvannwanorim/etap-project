import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { WalletRepository } from './repository/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
  exports: [WalletService],
})
export class WalletModule {}
