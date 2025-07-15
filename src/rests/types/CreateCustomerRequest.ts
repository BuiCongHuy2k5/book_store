import { RestRoles, Role } from '@Enums/RestRoles';
import { IsNotEmpty, Length, IsEmail, IsEnum, Matches } from 'class-validator';

export class CreateCustomerRequest {
  @IsNotEmpty()
  @Length(1, 50)
  customerCode: string;

  @IsNotEmpty()
  @Length(1, 100)
  customerName: string;

  @IsEnum(RestRoles, { message: 'GENDER ONLY FEMALE OR MALE' })
  gender: string;

  @IsNotEmpty()
  @Length(1, 20)
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
  })
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-\.]+@gmail\.com$/, {
    message: 'EMAIL MUST BE A VALID EMAIL ADDRESS @gmail.com',
  })
  @Length(1, 100)
  email: string;

  @IsNotEmpty()
  @Length(1, 255)
  address: string;

  @IsNotEmpty()
  accountId: number;
}
