import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { BookDetail } from './BookDetail';

@Entity({ name: 'Image' })
export class Image {
  @PrimaryGeneratedColumn({ name: 'ImageId' })
  imageId: number;

  @ManyToOne(() => BookDetail)
  @JoinColumn({ name: 'BookDetailId' })
  bookDetail: BookDetail;

  @RelationId((img: Image) => img.bookDetail)
  bookDetailId: number;

  @Column({ type: 'text', name: 'Link' })
  link: string;

  @Column({ length: 255, name: 'Name' })
  name: string;

  @Column({ length: 50, name: 'Size' })
  size: string;
}
