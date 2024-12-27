import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtorDto {
  @ApiProperty({ description: 'Имя должника', example: 'Иван' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Фамилия должника', example: 'Иванов' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Номер телефона должника', example: '+79001234567' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Номер WhatsApp должника', example: '+79001234567' })
  @IsPhoneNumber()
  @IsNotEmpty()
  whatsapp: string;

  @ApiProperty({ description: 'Флаг проблемного должника', default: false })
  @IsOptional()
  @IsBoolean()
  isProblematic?: boolean;
} 