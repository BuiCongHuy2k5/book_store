import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateCartDetailResponse {
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
