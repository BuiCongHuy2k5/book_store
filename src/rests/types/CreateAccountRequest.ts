import { Role } from '@Enums/RestRoles';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';

export class CreateAccountRequest {
  @IsNotEmpty()
  @Length(1, 100)
  username: string;

  @IsNotEmpty()
  @Length(1, 100)
  password: string;

  @IsEnum(Role, { message: 'ONLY 1 OF 2 ROLES "ADMIN" & "USER" CAN BE SELECTED' })
  role: string;
}
