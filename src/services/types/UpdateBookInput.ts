export class UpdateBookInput {
  id: number;
  bookCode?: string;
  bookName?: string;
  cateId?: number;
  authorId?: number;
  publisherId?: number;
  status?: string;
  imageurl?: string;
}
