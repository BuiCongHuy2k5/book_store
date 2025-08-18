export class UpdateInvoiceInput {
  id: number;
  invoiceCode?: string;
  customerId?: number;
  employeeId?: number;
  price?: number;
  quantity?: number;
  bookId?: number;
  status?: string;
}
