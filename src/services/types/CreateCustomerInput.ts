import { IsEmail, Matches } from 'class-validator';

export class CreateCustomerInput {
  customerCode: string;
  customerName: string;
  gender: string;
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
  })
  phone: string;
  @IsEmail()
  @Matches(/^[\w-\.]+@gmail\.com$/, {
    message: 'EMAIL MUST BE A VALID EMAIL ADDRESS @gmail.com',
  })
  email: string;
  address: string;
  accountId: number;
}
