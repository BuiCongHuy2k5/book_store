import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryRequest {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsString()
  inventoryCode: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  minThreshold: number;

  @IsNotEmpty()
  @IsNumber()
  maxThreshold: number;

  @IsNotEmpty()
  @IsString()
  location: string;
}
