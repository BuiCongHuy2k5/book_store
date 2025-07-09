import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateBookDetailResponse {
  @Expose()
  bookDetailId: number;

  @Expose()
  bookDetailCode: string;

  @Expose()
  bookId: number;

  @Expose()
  publisherId: number;

  @Expose()
  language: string;

  @Expose()
  pages: number;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  @Expose()
  description: string;

  @Expose()
  status: string;
}
