import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TransactionHistory } from '../entity/transaction-history.entity';

@Injectable()
export class TransactionHistoryRepository extends Repository<TransactionHistory> {
  constructor(dataSource: DataSource) {
    super(TransactionHistory, dataSource.createEntityManager());
  }

  async getMonthlySummaries(): Promise<any[]> {
    try {
      const results = await this.createQueryBuilder('transaction_history')
        .select("TO_CHAR(transaction_history.created_at, 'YYYY-MM') as month")
        .addSelect('SUM(transaction_history.amount) as total_amount')
        .addSelect('transaction_history.transaction_type as transaction_type')
        .where('transaction_history.status = :status', { status: 1 })
        .groupBy('transaction_history.transaction_type, month')
        .orderBy('transaction_history.transaction_type, month', 'ASC')
        .getRawMany();

      return results;
    } catch (error) {
      throw error;
    }
  }

  async currentMonthSummaries(): Promise<any[]> {
    try {
      const currentDate = new Date();
      const current_year = currentDate.getFullYear();
      const current_month = currentDate.getMonth() + 1;

      const results = await this.createQueryBuilder('transaction_history')
        .select("TO_CHAR(transaction_history.created_at, 'YYYY-MM') as month")
        .addSelect('SUM(transaction_history.amount) as total_amount')
        .addSelect('transaction_history.transaction_type as transaction_type')
        .where('transaction_history.status = :status', { status: 1 })
        .andWhere('EXTRACT(YEAR FROM transaction_history.created_at) = :year', {
          year: current_year,
        })
        .andWhere(
          'EXTRACT(MONTH FROM transaction_history.created_at) = :month',
          {
            month: current_month,
          },
        )
        .groupBy('transaction_history.transaction_type, month')
        .getRawMany();

      return results;
    } catch (error) {
      throw error;
    }
  }
}
