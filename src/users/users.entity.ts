import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Auth } from '../auth/auth.entity';
import { Bank } from '../bank/bank.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('idx_user_username', ['username'], { unique: true })
  username: string;

  @Column({ unique: true })
  @Index('idx_user_email', ['email'], { unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  email_is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  @OneToMany(() => Bank, (bank) => bank.user)
  photos: Bank[];
}
