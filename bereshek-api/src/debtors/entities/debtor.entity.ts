import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Debt } from '../../debts/entities/debt.entity';

@Entity('debtors')
export class Debtor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  whatsapp: string;

  @Column({ default: false })
  isProblematic: boolean;

  @ManyToOne(() => User, user => user.debtors)
  user: User;

  @OneToMany(() => Debt, debt => debt.debtor)
  debts: Debt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 