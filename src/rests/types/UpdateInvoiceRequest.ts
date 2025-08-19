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
  price?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  bookId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
