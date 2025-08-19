import { Gender, RestRoles } from '@Enums/RestRoles';
import { IsNotEmpty, Length, IsEmail, IsEnum, Matches, IsString } from 'class-validator';

export class CreateCustomerRequest {
  @IsNotEmpty()
  @IsString()
  customerCode: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsEnum(Gender, { message: 'GENDER ONLY FEMALE OR MALE' })
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
  })
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-\.]+@gmail\.com$/, {
    message: 'EMAIL MUST BE A VALID EMAIL ADDRESS @gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  accountId: number;
}
