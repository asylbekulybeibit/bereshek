import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterDebtorDto {
  @ApiProperty({ 
    description: 'Поисковый запрос (имя, фамилия или телефон)',
    required: false,
    example: 'Иван'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    description: 'Фильтр по проблемным должникам',
    required: false,
    example: true
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isProblematic?: boolean;

  @ApiProperty({ 
    description: 'Фильтр по наличию активных долгов',
    required: false,
    example: true
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasActiveDebts?: boolean;

  @ApiProperty({ 
    description: 'Фильтр по наличию просроченных долгов',
    required: false,
    example: true
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasOverdueDebts?: boolean;

  @ApiProperty({ 
    description: 'Поле для сортировки',
    required: false,
    enum: ['firstName', 'lastName', 'createdAt'],
    example: 'createdAt'
  })
  @IsOptional()
  @IsString()
  sortBy?: 'firstName' | 'lastName' | 'createdAt';

  @ApiProperty({ 
    description: 'Порядок сортировки',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC'
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
} 