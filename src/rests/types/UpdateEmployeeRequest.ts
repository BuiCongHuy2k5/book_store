import { RestRoles } from '@Enums/RestRoles';
import { IsOptional, Length, IsDateString, Matches, IsEnum } from 'class-validator';

export class UpdateEmployeeRequest {
  @IsOptional()
  @Length(1, 50)
  employeeCode?: string;

  @IsOptional()
  @Length(1, 100)
  employeeName?: string;

  @IsEnum(RestRoles, { message: 'GENDER ONLY FEMALE OR MALE' })
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @Length(1, 11)
  @Matches(/^(0|\+84)\d{9}$/, {
        message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
      })
  phone?: string;

  @IsOptional()
  @Length(1, 255)
  address?: string;

  @IsOptional()
  accountId?: number;

  @IsOptional()
  @Length(1, 20)
  status?: string;
}
