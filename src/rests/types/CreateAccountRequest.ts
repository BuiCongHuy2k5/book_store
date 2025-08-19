import { UserRole } from '@Enums/RestRoles';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountRequest {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  passWord: string;

  @IsEnum(UserRole, { message: 'ONLY 1 OF 2 ROLES "ADMIN" & "USER" CAN BE SELECTED' })
  role: UserRole;
}
