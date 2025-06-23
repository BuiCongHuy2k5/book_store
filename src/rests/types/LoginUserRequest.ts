import { IsEmail, IsString } from 'class-validator';

export class LoginUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  passWord: string;
}