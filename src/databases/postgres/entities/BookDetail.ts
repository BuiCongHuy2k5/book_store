import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Book } from './Book';
import { Publisher } from './Publisher';
import { Author } from './Author';

@Entity({ name: 'BookDetail' })
export class BookDetail {
  @PrimaryGeneratedColumn({ name: 'BookDetailId' })
  bookDetailId: number;

  @Column({ length: 50, name: 'BookDetailCode'  })
  bookDetailCode: string;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'BookId' })
  book: Book;

  @RelationId((bd: BookDetail) => bd.book)
  bookId: number;

  @ManyToOne(() => Publisher)
  @JoinColumn({ name: 'PublisherId' })
  publisher: Publisher;

  @RelationId((bd: BookDetail) => bd.publisher)
  publisherId: number;

  @ManyToOne(() => Author)
  @JoinColumn({ name: 'AuthorId' })
  author: Author;

  @RelationId((bd: BookDetail) => bd.author)
  authorId: number;

  @Column({ length: 20, name: 'Language'  })
  language: string;

  @Column({name: 'Pages' })
  pages: number;

  @Column({name: 'Quantity' })
  quantity: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'Price'  })
  price: number;

  @Column({ type: 'text', nullable: true, name: 'Description'  })
  description: string;

  @Column({ length: 20, name: 'Status'  })
  status: string;
}
