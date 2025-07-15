export class UpdateInvoiceInput {
  invoiceId: number;
  invoiceCode?: string;
  customerId?: number;
  employeeId?: number;
  totalAmount?: number;
  bookName?: string;
  status?: string;
}
