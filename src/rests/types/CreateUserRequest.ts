import { IsDateString, IsEmail, IsOptional, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CreateUserRequest {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(0|\+84)\d{9}$/, {
    message: 'Số điện thoại không hợp lệ. VD: 0351234567 hoặc +84351234567',
  })
  phoneNumber: string;

  @IsString()
  passWord: string;

  @IsString()
  userName: string;

  @IsString()
  genDer: string;

  @IsDateString()
  birtDate: Date;
}
