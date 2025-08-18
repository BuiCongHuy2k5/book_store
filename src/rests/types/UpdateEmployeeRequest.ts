import { Gender, RestRoles } from '@Enums/RestRoles';
import { IsOptional, Length, IsDateString, Matches, IsEnum, IsString } from 'class-validator';

export class UpdateEmployeeRequest {
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @IsOptional()
  @IsString()
  employeeName?: string;

  @IsEnum(Gender, { message: 'GENDER ONLY FEMALE OR MALE' })
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  accountId?: number;

  @IsOptional()
  status?: string;
}
