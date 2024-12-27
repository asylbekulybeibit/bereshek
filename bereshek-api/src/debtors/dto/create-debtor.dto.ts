import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateDebtorDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsPhoneNumber()
  phone: string;

  @IsPhoneNumber()
  whatsapp: string;
} 