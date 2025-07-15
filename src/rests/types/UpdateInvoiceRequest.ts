import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateInvoiceRequest {
  @IsOptional()
  @IsString()
  invoiceCode?: string;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  bookName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
