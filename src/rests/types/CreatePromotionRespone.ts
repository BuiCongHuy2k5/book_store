import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreatePromotionResponse {
  @Expose()
  promotionId: number;

  @Expose()
  promotionCode: string;

  @Expose()
  promotionName: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  quantity: number;

  @Expose()
  status: string;
}
