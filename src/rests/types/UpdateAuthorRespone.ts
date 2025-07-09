import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateAuthorResponse {
  @Expose()
  authorId: number;

  @Expose()
  authorCode: string;

  @Expose()
  authorName: string;

  @Expose()
  status: string;
}
