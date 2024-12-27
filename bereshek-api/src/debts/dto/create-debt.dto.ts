import { IsNotEmpty, IsNumber, IsDateString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtDto {
  @ApiProperty({ 
    description: 'Сумма долга',
    example: 1000,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiProperty({ 
    description: 'Дата взятия долга',
    example: '2024-01-01T10:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  borrowDate: Date;

  @ApiProperty({ 
    description: 'Дата возврата долга',
    example: '2024-02-01T10:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({ 
    description: 'ID должника',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  debtorId: string;
} 