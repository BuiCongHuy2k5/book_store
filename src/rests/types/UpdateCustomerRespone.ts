import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateCustomerResponse {
  @Expose()
  customerId: number;

  @Expose()
  customerCode: string;

  @Expose()
  customerName: string;

  @Expose()
  gender: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  address: string;

  @Expose()
  accountId: number;

  @Expose()
  status: string;
}
