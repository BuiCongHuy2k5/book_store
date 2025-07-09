import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateBookRequest {
  @IsNotEmpty()
  @IsString()
  bookCode: string;

  @IsNotEmpty()
  @IsString()
  bookName: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  status: string;
}