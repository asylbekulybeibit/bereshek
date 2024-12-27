import { IsOptional, IsEnum, IsDate, IsNumber, Min, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DebtStatus } from '../entities/debt.entity';

export class FilterDebtDto {
  @ApiProperty({ 
    description: 'Статус долга',
    enum: DebtStatus,
    required: false,
    example: DebtStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(DebtStatus)
  status?: DebtStatus;

  @ApiProperty({ 
    description: 'Начальная дата для фильтрации',
    required: false,
    example: '2024-01-01T00:00:00Z'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({ 
    description: 'Конечная дата для фильтрации',
    required: false,
    example: '2024-12-31T23:59:59Z'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ 
    description: 'Минимальная сумма долга',
    required: false,
    minimum: 0,
    example: 1000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiProperty({ 
    description: 'Максимальная сумма долга',
    required: false,
    minimum: 0,
    example: 5000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @ApiProperty({ 
    description: 'ID должника для фильтрации',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  debtorId?: string;

  @ApiProperty({ 
    description: 'Поисковый запрос по имени должника',
    required: false,
    example: 'Иван'
  })
  @IsOptional()
  @IsString()
  search?: string;
} 