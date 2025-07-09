import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  @IsNotEmpty({ message: 'CategoryName is required' })
  @MaxLength(100, { message: 'CategoryName must not exceed 100 characters' })
  categoryName: string;

  status: string;
}
