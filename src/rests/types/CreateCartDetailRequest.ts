import { IsInt, IsPositive, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCartDetailRequest {
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @IsInt()
  @IsNotEmpty()
  bookDetailId: number;

  @IsNotEmpty()
  @IsPositive() // Đảm bảo giá trị này là một số dương
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}
