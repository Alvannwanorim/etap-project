import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { USER_TYPE } from 'src/user/enums/user.enums';

@Controller('transaction-history')
export class TransactionHistoryController {
  constructor(private transactionHistoryService: TransactionHistoryService) {}

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_TYPE.ADMIN)
  async getPendingTransaction() {
    return await this.transactionHistoryService.getPendingTransaction();
  }

  @Get('monthly')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_TYPE.ADMIN)
  async getMonthlySummaries() {
    return await this.transactionHistoryService.getMonthlyPaymentSummaries();
  }
  @Get('current')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_TYPE.ADMIN)
  async getCurrentMonthSummaries() {
    return await this.transactionHistoryService.getCurrentMonthSummaries();
  }
}
