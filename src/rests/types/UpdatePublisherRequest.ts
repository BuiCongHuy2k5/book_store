import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePublisherRequest {
  @IsOptional()
  @IsString()
  publisherCode?: string;

  @IsOptional()
  @IsString()
  publisherName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  Adress?: string;
}
