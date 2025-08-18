import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateBookRequest {
  @IsOptional()
  @IsString()
  bookCode?: string;

  @IsOptional()
  @IsString()
  bookName?: string;

  @IsOptional()
  @IsString()
  cateName: string;

  @IsOptional()
  @IsString()
  publisherName: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString()
  imageurl: string;
}
