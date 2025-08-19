import { IsOptional, Length, IsNumber, IsString } from 'class-validator';

export class UpdateCartRequest {
  @IsOptional()
  cartCode?: string;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  bookId: number;

  @IsOptional()
  @IsNumber()
  accountId?: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  status?: string;
}
