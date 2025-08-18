import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateCategoryResponse {
  @Expose()
  id: number;

  @Expose()
  cateName: string;

  @Expose()
  status: string;
}
