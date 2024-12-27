import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Debtor } from '../../debtors/entities/debtor.entity';

export enum DebtStatus {
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

@Entity('debts')
export class Debt {
  @ApiProperty({ description: 'Уникальный идентификатор долга' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Сумма долга', example: 1000 })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Дата взятия долга' })
  @Column('timestamp')
  borrowDate: Date;

  @ApiProperty({ description: 'Дата возврата долга' })
  @Column('timestamp')
  dueDate: Date;

  @ApiProperty({ 
    description: 'Статус долга',
    enum: DebtStatus,
    example: DebtStatus.ACTIVE
  })
  @Column({
    type: 'enum',
    enum: DebtStatus,
    default: DebtStatus.ACTIVE,
  })
  status: DebtStatus;

  @ApiProperty({ description: 'Дата оплаты долга', nullable: true })
  @Column('timestamp', { nullable: true })
  paidDate?: Date;

  @ApiProperty({ description: 'Флаг отправки уведомления' })
  @Column({ default: false })
  notificationSent: boolean;

  @ApiProperty({ description: 'Дата создания записи' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата последнего обновления записи' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Debtor })
  @ManyToOne(() => Debtor, debtor => debtor.debts)
  debtor: Debtor;
} 