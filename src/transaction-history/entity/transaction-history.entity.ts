import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionHistoryInterface } from '../interface/transaction-history.interface';
import User from 'src/user/entity/user.entity';
import { TRANSACTION_TYPE } from '../enums/transaction_type.enum';

@Entity('transaction_history')
export class TransactionHistory implements TransactionHistoryInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({ enum: TRANSACTION_TYPE })
  transaction_type: TRANSACTION_TYPE;

  @Index('transaction_history_receiver_wallet_id_index')
  @Column()
  receiver_wallet_id: string;

  @Column({ nullable: true })
  sender_wallet_id: string;

  @Column({ default: '0' })
  status: number;

  @Index('transaction_history_user_index')
  @ManyToOne(() => User, (user) => user.transaction_histories)
  user: User;

  @Index('transaction_history_created_at_index')
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
