import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'CategoryName must not exceed 100 characters' })
  categoryName?: string;

  @IsOptional()
  status?: string;
}
