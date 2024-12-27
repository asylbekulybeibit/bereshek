import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';
import { DebtorsService } from './debtors.service';
import { DebtorsController } from './debtors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Debtor])],
  providers: [DebtorsService],
  controllers: [DebtorsController],
  exports: [DebtorsService],
})
export class DebtorsModule {} 