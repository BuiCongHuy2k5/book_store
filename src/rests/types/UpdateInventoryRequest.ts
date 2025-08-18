import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateInventoryRequest {
  @IsOptional()
  @IsNumber()
  bookId?: number;

  @IsOptional()
  @IsString()
  inventoryCode: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  minThreshold?: number;

  @IsOptional()
  @IsNumber()
  maxThreshold?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
