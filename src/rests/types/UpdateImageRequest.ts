import { IsNumber, IsOptional, IsString } from 'class-validator';


export class UpdateImageRequest {
  @IsOptional()
  @IsNumber()
  bookDetailId: number;

  @IsOptional()
  @IsString()
  link: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  size: string;
}
