import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletInterface } from '../interface/wallet.interface';
import User from 'src/user/entity/user.entity';
import { CURRENCY } from '../enums/wallet.enum';
@Entity('wallets')
export class Wallet implements WalletInterface {
  @PrimaryColumn()
  wallet_id: string;

  @PrimaryColumn({ enum: CURRENCY })
  currency: CURRENCY;

  @Column()
  name: string;

  @Column({ default: '0' })
  balance: number;

  @Column({ default: '0' })
  book_balance: number;

  @Column({ default: '0' })
  delete_flag: number;

  @Column({ default: '0' })
  dormant_flag: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Index('wallet_created_at_index')
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
