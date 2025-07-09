import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateImageRequest {
  @IsNotEmpty()
  @IsNumber()
  bookDetailId: number;

  @IsNotEmpty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  size: string;
}
