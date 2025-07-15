import { Language, RestRoles } from '@Enums/RestRoles';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

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
  @IsNumber()
  authorId: number;

  @IsEnum(Language, { message: 'language must be one of: VI, EN, DE, FR, YT, ES' })
  language: Language;

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
