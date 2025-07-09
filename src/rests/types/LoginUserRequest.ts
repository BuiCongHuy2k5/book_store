import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginUserRequest {
  @IsEmail()
   @Matches(/^[\w-\.]+@gmail\.com$/, {
      message: 'EMAIL MUST BE A VALID EMAIL ADDRESS @gmail.com',
    })
  email: string;

  @IsString()
  passWord: string;
}