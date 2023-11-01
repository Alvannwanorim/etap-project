import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/entity/wallet.entity';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';
import { TransactionHistory } from './transaction-history/entity/transaction-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'alvan2327',
      database: 'e-wallet',
      entities: [User, Wallet, TransactionHistory],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    WalletModule,
    TransactionHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
