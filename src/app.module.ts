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
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PAYSTACK_PAYMENT_API: Joi.string().required(),
        PAYSTACK_API_SECRET_KEY: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
