export class UpdateBookDetailInput {
  bookDetailId: number;
  bookDetailCode?: string;
  bookId?: number;
  publisherId?: number;
  language?: string;
  pages?: number;
  quantity?: number;
  price?: number;
  description?: string;
  status?: string;
}
