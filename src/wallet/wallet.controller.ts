import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { WalletDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createWallet(@Req() req, @Body() walletDto: WalletDto) {
    return await this.walletService.createWallet(req.user, walletDto.currency);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserWallets(@Req() req) {
    return await this.walletService.getUserWallets(req.user);
  }
}
