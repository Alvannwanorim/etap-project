import {
  IsPhoneNumber,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import UserInterface from '../interface/user.interface';

export class UserDto implements UserInterface {
  @IsPhoneNumber('NG')
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  first_name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, {
    message: 'Password must contain at least one number and one special symbol',
  })
  password: string;
}
