import { IsOptional, IsString, MaxLength, IsInt } from 'class-validator';

export class UpdateCategoryInput {
  @IsInt({ message: 'CategoryId must be an integer' })
  CategoryId: number;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'CategoryName must not exceed 100 characters' })
  categoryName?: string;

  @IsOptional()
  status?: string;
}
