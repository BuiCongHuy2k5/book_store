import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreateInvoiceResponse {
  @Expose()
  invoiceId: number;

  @Expose()
  invoiceCode: string;

  @Expose()
  customerId: number;

  @Expose()
  employeeId: number;

  @Expose()
  totalAmount: number;

  @Expose()
  bookName: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
