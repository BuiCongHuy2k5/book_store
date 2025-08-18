import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAuthorRequest {
  @IsOptional()
  @IsString()
  authorCode?: string;

  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsDateString()
  birtDate?: Date;

  @IsOptional()
  @IsString()
  status?: string;
}
