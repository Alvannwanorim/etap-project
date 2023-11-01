import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async createUser(@Body() user: UserDto) {
    return await this.authService.createUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() req) {
    return await this.authService.login(req.user);
  }
}
