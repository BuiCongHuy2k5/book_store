import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreateCategoryResponse {
  @Expose()
  categoryId: number;

  @Expose()
  categoryName: string;

  @Expose()
  status: string;
}
