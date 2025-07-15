import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreateCartDetailResponse {
  @Expose()
  cartDetailId: number;

  @Expose()
  cartId: number;

  @Expose()
  bookDetailId: number;

  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;
}
