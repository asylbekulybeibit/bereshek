import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email пользователя',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Пароль пользователя',
    example: 'password123'
  })
  @IsString()
  password: string;
} 