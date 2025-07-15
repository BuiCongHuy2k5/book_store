import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdatePaymentMethodResponse {
  @Expose()
  paymentMethodId: number;

  @Expose()
  name: string;
}
