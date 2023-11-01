import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import User from './entity/user.entity';
import { UserDto } from './dto/user.dto';

import * as bcrypt from 'bcrypt';
import { JwtDto } from 'src/auth/dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * @description fetches the record of existing user from the database
   * @param username
   * @returns `User` | null
   */
  public async getUserByUserName(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  }

  /**
   * @description Inserts user into the database
   * @param user
   * @returns `User` | null
   */
  public async createUser(user: UserDto): Promise<User> {
    const existingUser = await this.getUserByUserName(user.username);
    if (existingUser) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'phone number already exists',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const hashedPassword = await this.hashPassword(user.password);
    user.password = hashedPassword;
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  /**
   * @description hash and return user password
   * @param password: string
   * @returns hash password
   */
  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  /**
   * @description compares and valid existing user credentials
   * @param username: string
   * @param password: string
   * @returns `User`
   */
  async validate(username: string, password: string) {
    const user = await this.getUserByUserName(username);
    if (!user) return;

    const isMatch = await this.comparePasswords(user.password, password);

    if (!isMatch) return;
    return user;
  }

  /**
   * @description compares user hashed password and password passed for authentication
   * @param hashedPassword: string
   * @param password: string
   * @returns `Boolean`
   */
  private async comparePasswords(hashedPassword: string, password: string) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }

  /**
   * @description validate and return access token for user
   * @param user: `User`
   * @returns `JwtDto`
   */
  async login(user: User) {
    const payload: JwtDto = {
      username: user.username,
      sub: String(user.id),
    };

    const access_token = this.signToken(payload);
    return { access_token };
  }

  /**
   * @description sign and return user payload
   * @param payload: `JwtDto`
   * @returns signed access token
   */
  private signToken(payload: JwtDto) {
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return access_token;
  }
}
