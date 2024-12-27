import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    description: 'Email пользователя',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Имя пользователя',
    example: 'Иван',
    required: false
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ 
    description: 'Фамилия пользователя',
    example: 'Иванов',
    required: false
  })
  @IsOptional()
  @IsString()
  lastName?: string;
} 