import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CreateBookDetailResponse {
  @Expose()
  bookDetailId: number;

  @Expose()
  bookDetailCode: string;

  @Expose()
  @Transform(({ obj }) => obj.bookId)
  bookId: number;

  @Expose()
  @Transform(({ obj }) => obj.publisherId)
  publisherId: number;
  
  @Expose()
  @Transform(({ obj }) => obj.authorId)
  authorId: number;

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
