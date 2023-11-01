import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TransactionHistory } from '../entity/transaction-history.entity';

@Injectable()
export class TransactionHistoryRepository extends Repository<TransactionHistory> {
  constructor(dataSource: DataSource) {
    super(TransactionHistory, dataSource.createEntityManager());
  }
}
