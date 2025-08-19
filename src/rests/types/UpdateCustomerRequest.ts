import { Gender, RestRoles } from '@Enums/RestRoles';
import { IsOptional, Length, IsEmail, IsEnum, Matches, IsString } from 'class-validator';

export class UpdateCustomerRequest {
  @IsOptional()
  @IsString()
  customerCode?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsEnum(Gender, { message: 'GENDER ONLY FEMALE OR MALE' })
  gender?: Gender;

  @IsOptional()
  @Length(1, 20)
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
  })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @Matches(/^[\w-\.]+@gmail\.com$/, {
    message: 'EMAIL MUST BE A VALID EMAIL ADDRESS @gmail.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  status?: string;
}
