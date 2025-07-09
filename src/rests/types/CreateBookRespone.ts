import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreateBookResponse {
  @Expose()
  bookId: number;

  @Expose()
  bookCode: string;

  @Expose()
  bookName: string;

  @Expose()
  categoryId: number;

  @Expose()
  authorId: number;

  @Expose()
  authorName: string;

  @Expose()
  status: string;
}