import { IsOptional, Length, IsNumber } from 'class-validator';

export class UpdateCartRequest {
  @IsOptional()
  @Length(1, 50)
  cartCode?: string;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  accountId?: number;

  @IsOptional()
  @Length(1, 20)
  status?: string;
}
