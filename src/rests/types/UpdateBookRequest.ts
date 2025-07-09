import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookRequest {
  @IsOptional()
  @IsString()
  bookCode?: string;

  @IsOptional()
  @IsString()
  bookName?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  status?: string;
}
