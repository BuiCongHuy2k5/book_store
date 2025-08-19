import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateStockResponse {
  @Expose()
  stockId: number;

  @Expose()
  bookDetailId: number;

  @Expose()
  quantity: number;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
