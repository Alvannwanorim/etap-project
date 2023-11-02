import { Injectable } from '@nestjs/common';
import { TransactionHistoryRepository } from './repository/transaction-history.repository';
import { TransactionHistoryDto } from './dto/transaction-history.dto';

@Injectable()
export class TransactionHistoryService {
  constructor(
    private transactionHistoryRepository: TransactionHistoryRepository,
  ) {}

  async createTransactionHistory(transactionHistoryDto: TransactionHistoryDto) {
    const history = this.transactionHistoryRepository.create(
      transactionHistoryDto,
    );
    await this.transactionHistoryRepository.save(history);
    // console.log(newHistory);
  }
}
