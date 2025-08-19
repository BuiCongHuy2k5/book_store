import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateCartResponse {
  @Expose()
  cartId: number;

  @Expose()
  cartCode: string;

  @Expose()
  customerId: number;

  @Expose()
  accountId: number;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
