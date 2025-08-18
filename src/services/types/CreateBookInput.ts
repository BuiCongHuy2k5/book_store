export class CreateBookInput {
  bookCode: string;
  bookName: string;
  cateId: number;
  authorId: number;
  publisherId: number;
  status?: string;
  imageurl: string;
}
