import { IsNumber, IsString } from 'class-validator';

export class ChangePasswordInput {
  @IsNumber()
  id: number;

  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
