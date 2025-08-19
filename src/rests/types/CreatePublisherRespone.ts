import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreatePublisherResponse {
  @Expose()
  publisherId: number;

  @Expose()
  publisherCode: string;

  @Expose()
  publisherName: string;

  @Expose()
  status: string;
}
