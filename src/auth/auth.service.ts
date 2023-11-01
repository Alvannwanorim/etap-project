import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  public async createUser(user: UserDto) {
    return this.userService.createUser(user);
  }

  async validate(username: string, password: string) {
    return await this.userService.validate(username, password);
  }
  async validateUsername(username: string) {
    return await this.userService.getUserByUserName(username);
  }

  async login(user: any) {
    return await this.userService.login(user);
  }
}
