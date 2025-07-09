import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateAuthorRequest {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  authorCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  authorName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
