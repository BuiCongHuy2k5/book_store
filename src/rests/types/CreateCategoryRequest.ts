import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  cateName: string;

  @IsString()
  @IsNotEmpty({ message: 'code is required' })
  cateCode: string;

  status: string;
}
