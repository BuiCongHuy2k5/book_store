import { RestRoles, Role } from '@Enums/RestRoles';
import { IsOptional, Length, IsEmail, IsEnum, Matches } from 'class-validator';

export class UpdateCustomerRequest {
  @IsOptional()
  @Length(1, 50)
  customerCode?: string;

  @IsOptional()
  @Length(1, 100)
  customerName?: string;

  @IsEnum(RestRoles, { message: 'GENDER ONLY FEMALE OR MALE' })
  gender?: string;

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
  @Length(1, 100)
  email?: string;

  @IsOptional()
  @Length(1, 255)
  address?: string;

  @IsOptional()
  accountId?: number;

  @IsOptional()
  @Length(1, 20)
  status?: string;
}
