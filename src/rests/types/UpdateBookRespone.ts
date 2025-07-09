import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UpdateBookResponse {
  @Expose()
  bookId: number;

  @Expose()
  bookCode?: string;

  @Expose()
  bookName?: string;

  @Expose()
  categoryId?: number;

  @Expose()
  authorId?: number;

  @Expose()
  authorName: string;

  @Expose()
  status?: string;
}
