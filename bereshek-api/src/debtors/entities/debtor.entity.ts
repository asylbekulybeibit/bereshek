import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Debt } from '../../debts/entities/debt.entity';

@Entity('debtors')
export class Debtor {
  @ApiProperty({ description: 'Уникальный идентификатор должника' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Имя должника' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Фамилия должника' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Номер телефона должника' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Номер WhatsApp должника' })
  @Column()
  whatsapp: string;

  @ApiProperty({ description: 'Флаг проблемного должника' })
  @Column({ default: false })
  isProblematic: boolean;

  @ApiProperty({ description: 'Дата создания записи' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата последнего обновления записи' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.debtors)
  user: User;

  @ApiProperty({ type: () => [Debt], description: 'Список долгов должника' })
  @OneToMany(() => Debt, debt => debt.debtor)
  debts: Debt[];
} 