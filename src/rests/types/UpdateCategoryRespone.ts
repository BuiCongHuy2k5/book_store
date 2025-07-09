import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateCategoryResponse {
  @Expose()
  categoryId: number;

  @Expose()
  categoryName: string;

  @Expose()
  status: string;
}
