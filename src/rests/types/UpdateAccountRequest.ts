import { Role } from '@Enums/RestRoles';
import { IsEnum, IsOptional, Length } from 'class-validator';

export class UpdateAccountRequest {
  @IsOptional()
  @Length(1, 100)
  username?: string;

  @IsOptional()
  @Length(1, 100)
  password?: string;

  @IsEnum(Role, { message: 'ONLY 1 OF 2 ROLES "ADMIN" & "USER" CAN BE SELECTED' })
  role?: string;

  @IsOptional()
  @Length(1, 20)
  status?: string;
}
