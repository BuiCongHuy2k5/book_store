import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryRequest {
  @IsOptional()
  @IsString()
  cateName?: string;

  @IsOptional()
  @IsString()
  cateCode?: string;

  @IsOptional()
  status?: string;
}
