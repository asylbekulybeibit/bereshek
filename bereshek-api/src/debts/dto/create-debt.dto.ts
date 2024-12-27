import { IsNumber, IsDate, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDebtDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @Type(() => Date)
  @IsDate()
  borrowDate: Date;

  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @IsUUID()
  debtorId: string;
} 