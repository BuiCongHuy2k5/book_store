import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePublisherRequest {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  publisherCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  publisherName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
