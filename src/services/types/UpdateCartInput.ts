export class UpdateCartInput {
  id: number;
  cartCode?: string;
  customerId?: number;
  bookId?: number;
  accountId?: number;
  status?: string;
  price?: number;
  quantity?: number;
  totalAmount?: number;
}
