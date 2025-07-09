import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId
} from 'typeorm';
import { Category } from './Category';
import { Author } from './Author';

@Entity({ name: 'Book' })
export class Book {
  @PrimaryGeneratedColumn({name: 'BookId'})
  bookId: number;

  @Column({ length: 50, name: 'BookCode' })
  bookCode: string;

  @Column({ length: 100, name: 'BookName' })
  bookName: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'CategoryId' })
  category: Category;

  @RelationId((book: Book) => book.category)
  categoryId: number;

  @ManyToOne(() => Author)
  @JoinColumn({ name: 'AuthorId' })
  author: Author;

  @RelationId((book: Book) => book.author)
  authorId: number;

  @Column({ length: 20, name: 'Status' })
  status: string;
}