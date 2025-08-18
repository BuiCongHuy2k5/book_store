import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthorRequest {
  @IsNotEmpty()
  @IsString()
  authorCode: string;

  @IsNotEmpty()
  @IsString()
  authorName: string;

  @IsNotEmpty()
  @IsDateString()
  birtDate: Date;
}
