import { UserRole } from '@Enums/RestRoles';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAccountRequest {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  passWord?: string;

  @IsEnum(UserRole, { message: 'ONLY 1 OF 2 ROLES "ADMIN" & "USER" CAN BE SELECTED' })
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
