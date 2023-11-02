import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { WalletDto } from './dto/wallet.dto';
import { WalletTransferDto } from './dto/wallet_transfer.dto';

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
}
