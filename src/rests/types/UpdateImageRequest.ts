import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateImageResponse {
  @Expose()
  imageId: number;

  @Expose()
  bookDetailId: number;

  @Expose()
  link: string;

  @Expose()
  name: string;

  @Expose()
  size: string;
}
