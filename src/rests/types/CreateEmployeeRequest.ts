import { RestRoles } from '@Enums/RestRoles';
import { IsNotEmpty, Length, IsDateString, IsEnum, Matches } from 'class-validator';

export class CreateEmployeeRequest {
  @IsNotEmpty()
  @Length(1, 50)
  employeeCode: string;

  @IsNotEmpty()
  @Length(1, 100)
  employeeName: string;

  @IsEnum(RestRoles, { message: 'GENDER ONLY FEMALE OR MALE' })
  gender: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsNotEmpty()
  @Length(1, 11)
  @Matches(/^(0|\+84)\d{9}$/, {
      message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
    })
  phone: string;

  @IsNotEmpty()
  @Length(1, 255)
  address: string;

  @IsNotEmpty()
  accountId: number;
}
