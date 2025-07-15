export class UpdatePromotionInput {
  promotionId: number;
  promotionCode?: string;
  promotionName?: string;
  startDate?: Date;
  endDate?: Date;
  quantity?: number;
  status?: string;
}
