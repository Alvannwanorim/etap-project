import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { WalletDto } from './dto/wallet.dto';
import { WalletTransferDto } from './dto/wallet_transfer.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { USER_TYPE } from 'src/user/enums/user.enums';
import { FundWalletDto } from './dto/fund_wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createWallet(@Req() req, @Body() walletDto: WalletDto) {
    return await this.walletService.createWallet(req.user, walletDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserWallets(@Req() req) {
    return await this.walletService.getUserWallets(req.user);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transferFundToWallet(
    @Body() walletTransferDto: WalletTransferDto,
    @Req() req,
  ) {
    return await this.walletService.transferFundToWallet(
      walletTransferDto,
      req.user,
    );
  }

  @Post('fund')
  @UseGuards(JwtAuthGuard)
  async FundToWallet(@Body() fundWalletDto: FundWalletDto, @Req() req) {
    return await this.walletService.fundWallet(fundWalletDto, req.user);
  }

  @Get('transaction/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_TYPE.ADMIN)
  async getPendingTransactions() {
    return await this.walletService.getPendingTransaction();
  }

  @Get('transaction/pending/:transaction_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_TYPE.ADMIN)
  async approvePendingTransaction(
    @Param('transaction_id') transaction_id: number,
  ) {
    return await this.walletService.approvePendingTransaction(
      transaction_id as number,
    );
  }
}
