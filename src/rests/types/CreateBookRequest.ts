import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';

export class CreateBookRequest {
  @IsNotEmpty()
  @IsString()
  bookCode: string;

  @IsNotEmpty()
  @IsString()
  bookName: string;

  @IsNotEmpty()
  @IsNumber()
  cateId: number;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsNotEmpty()
  @IsNumber()
  publisherId: number;

  @IsNotEmpty()
  @IsString()
  imageurl: string;
}
