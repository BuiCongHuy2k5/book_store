import { IsOptional, IsNotEmpty, IsString, IsDate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePromotionRequest {

  @IsOptional()
  @IsString()
  promotionCode?: string;

  @IsOptional()
  @IsString()
  promotionName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
