import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getPendingTransaction() {
    return await this.transactionHistoryRepository.find({
      where: { status: 0 },
    });
  }
  async getMonthlyPaymentSummaries() {
    return await this.transactionHistoryRepository.getMonthlySummaries();
  }
  async getCurrentMonthSummaries() {
    return await this.transactionHistoryRepository.currentMonthSummaries();
  }

  async getAndApproveTransactionById(transaction_id: number) {
    const transaction = await this.transactionHistoryRepository.findOne({
      where: { id: transaction_id },
    });
    if (transaction && transaction.status === 1)
      throw new BadRequestException('Transaction has been updated');

    if (transaction && transaction.status === 0) {
      transaction.status = 1;
      await this.transactionHistoryRepository.save(transaction);
    }

    return transaction;
  }
}
