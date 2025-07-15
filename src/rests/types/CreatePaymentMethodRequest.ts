import { IsNotEmpty, Length } from 'class-validator';

export class CreatePaymentMethodRequest {
  @IsNotEmpty()
  @Length(1, 50)
  name: string;
}
