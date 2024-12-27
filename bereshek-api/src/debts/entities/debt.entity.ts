import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Debtor } from '../../debtors/entities/debtor.entity';

export enum DebtStatus {
  ACTIVE = 'active',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  borrowDate: Date;

  @Column()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: DebtStatus,
    default: DebtStatus.ACTIVE
  })
  status: DebtStatus;

  @Column({ nullable: true })
  paidDate: Date;

  @Column({ default: false })
  notificationSent: boolean;

  @ManyToOne(() => Debtor, debtor => debtor.debts)
  debtor: Debtor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 