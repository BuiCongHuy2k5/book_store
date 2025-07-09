import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBookDetailRequest {
  @IsNotEmpty()
  @IsString()
  bookDetailCode: string;

  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  publisherId: number;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsNumber()
  pages: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
