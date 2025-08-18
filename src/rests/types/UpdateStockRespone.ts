import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateStockResponse {
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
