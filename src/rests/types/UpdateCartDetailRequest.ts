import { IsNumber, IsOptional } from "class-validator";

export class UpdateCartDetailRequest {
  @IsOptional()
  @IsNumber()
  cartId?: number;

  @IsOptional()
  @IsNumber()
  bookDetailId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}
