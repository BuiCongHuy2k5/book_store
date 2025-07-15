import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreatePaymentMethodResponse {
  @Expose()
  paymentMethodId: number;

  @Expose()
  name: string;
}
