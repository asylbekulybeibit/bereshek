import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { DebtorsModule } from '../debtors/debtors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Debt]),
    DebtorsModule,
  ],
  providers: [DebtsService],
  controllers: [DebtsController],
  exports: [DebtsService],
})
export class DebtsModule {} 