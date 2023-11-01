import { USER_TYPE } from '../enums/user.enums';

export default interface UserInterface {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  user_type?: USER_TYPE;
  delete_flag?: number;
  is_active?: number;
}
