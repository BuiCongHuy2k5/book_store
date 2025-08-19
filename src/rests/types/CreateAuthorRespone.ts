import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateAuthorResponse {
  @Expose()
  id: number;

  @Expose()
  authorCode: string;

  @Expose()
  authorName: string;

  @Expose()
  birtDate: Date;

  @Expose()
  status: string;
}
