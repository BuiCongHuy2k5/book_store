import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePublisherRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  publisherCode: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  publisherName: string;
}
