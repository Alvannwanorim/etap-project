import { Wallet } from 'src/wallet/entity/wallet.entity';
import { USER_TYPE } from '../enums/user.enums';
import UserInterface from '../interface/user.interface';
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity('users')
export default class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('username_index')
  @Column({ unique: true })
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @Column({ enum: USER_TYPE, default: USER_TYPE.USER })
  user_type: USER_TYPE;

  @Column({ default: '0' })
  delete_flag: number;

  @Column({ default: '0' })
  is_active: number;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @Index('user_created_at_index')
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
