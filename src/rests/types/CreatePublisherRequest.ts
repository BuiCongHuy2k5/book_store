import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePublisherRequest {
  @IsNotEmpty()
  @IsString()
  publisherCode: string;

  @IsNotEmpty()
  @IsString()
  publisherName: string;

  @IsNotEmpty()
  @IsString()
  Adress: string;
}
