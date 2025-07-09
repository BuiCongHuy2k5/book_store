export class UpdateBookInput {
  bookId: number;
  bookCode?: string;
  bookName?: string;
  categoryId?: number;
  authorId?: number;
  status?: string;
}