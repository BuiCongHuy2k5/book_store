import { IsOptional, IsString } from "class-validator";

export class UpdatePaymentMethodRequest {
  @IsOptional()
  @IsString()
  name?: string;
}
