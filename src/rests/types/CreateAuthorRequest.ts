import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthorRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  authorCode: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  authorName: string;
}
