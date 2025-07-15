import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInvoiceRequest {
  @IsNotEmpty()
  @IsString()
  invoiceCode: string;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsString()
  bookName: string;
}
