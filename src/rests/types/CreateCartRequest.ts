import { IsNotEmpty, Length, IsNumber, IsString } from 'class-validator';

export class CreateCartRequest {
  @IsNotEmpty()
  @IsString()
  cartCode: string;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
