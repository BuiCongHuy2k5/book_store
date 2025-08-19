import { IsString } from 'class-validator';

export class LoginInput {
  @IsString()
  userName: string;

  @IsString()
  passWord: string;
}
