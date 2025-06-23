import { IsOptional, IsEmail, IsString, IsPhoneNumber, Matches } from "class-validator";
import { ID } from "type-graphql";

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)\d{9}$/, {
  message: 'Số điện thoại không hợp lệ. VD: 0351234567 hoặc +84351234567',
})
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  passWord?: string;

  @IsOptional()
  @IsString()
  genDer?: string;

  @IsOptional()
  @IsString()
  birtDate?: Date;
}