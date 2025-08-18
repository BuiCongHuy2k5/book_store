import { Exclude, Expose, Type } from 'class-transformer';
import { Author } from 'databases/postgres/entities/Author';
import { Category } from 'databases/postgres/entities/Category';

@Exclude()
export class UpdateBookResponse {
  @Expose()
  id: number;

  @Expose()
  bookCode?: string;

  @Expose()
  bookName?: string;

  @Expose()
  @Type(() => Category)
  cateName?: Category;

  @Expose()
  @Type(() => Author)
  authorName?: Author;

  @Expose()
  status?: string;

  @Expose()
  iamgeurl?: string;
}
