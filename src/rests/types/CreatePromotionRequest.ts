import { IsNotEmpty, IsString, Length, IsDate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  promotionCode: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  promotionName: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
