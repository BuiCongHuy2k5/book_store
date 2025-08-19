import { Matches } from 'class-validator';

export class CreateEmployeeInput {
  employeeCode: string;
  employeeName: string;
  gender: string;
  birthDate: Date;
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
  })
  phone: string;
  address: string;
  accountId: number;
}
