import { IsNotEmpty, Length, IsNumber } from 'class-validator';

export class CreateCartRequest {
  @IsNotEmpty()
  @Length(1, 50)
  cartCode: string;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  accountId: number;
}
