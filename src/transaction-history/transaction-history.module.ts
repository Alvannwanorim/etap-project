import { Module } from '@nestjs/common';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryService } from './transaction-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistory } from './entity/transaction-history.entity';
import { TransactionHistoryRepository } from './repository/transaction-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionHistory])],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService, TransactionHistoryRepository],
  exports: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
