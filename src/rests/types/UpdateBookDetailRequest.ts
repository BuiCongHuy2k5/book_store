import { Language, RestRoles } from '@Enums/RestRoles';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

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
  @IsNumber()
  authorId?: number;

  @IsEnum(Language, { message: 'language must be one of: VI, EN, DE, FR, YT, ES' })
  language?: Language;

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
  @IsEnum(RestRoles)
  status?: string;
}
