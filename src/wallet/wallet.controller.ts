import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createWallet(@Req() req) {
    return await this.walletService.createWallet(req.user);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserWallets(@Req() req) {
    return await this.walletService.getUserWallets(req.user);
  }
}
