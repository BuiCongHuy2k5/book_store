import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreateCategoryResponse {
  @Expose()
  id: number;

  @Expose()
  cateName: string;

  @Expose()
  status: string;
}
