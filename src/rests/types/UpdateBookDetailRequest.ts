import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateBookDetailRequest {
  @IsOptional()
  @IsString()
  bookDetailCode?: string;

  @IsOptional()
  @IsNumber()
  bookId?: number;

  @IsOptional()
  @IsNumber()
  publisherId?: number;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  pages?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
