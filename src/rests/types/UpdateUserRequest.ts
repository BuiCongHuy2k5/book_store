import { RestRoles } from '@Enums/RestRoles';
import { IsOptional, IsEmail, IsString, IsPhoneNumber, Matches, IsDate, IsDateString, IsEnum } from 'class-validator';
import { ID } from 'type-graphql';

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  @Matches(/^[\w-\.]+@gmail\.com$/, {
    message: 'EMAIL MUST BE A VALID EMAIL ADDRESS @gmail.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  passWord?: string;

  @IsOptional()
  @IsEnum(RestRoles, { message: 'GENDER MUST BE MALE OR FEMALE' })
  genDer?: RestRoles; // enum

  @IsOptional()
  @IsDateString({}, { message: 'BIRTH DATE MUST BE A VALID ISO DATE STRING YYY-MMM-DDD' })
  birtDate?: Date;
}
