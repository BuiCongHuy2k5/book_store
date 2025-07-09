import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Author' })
export class Author {
  @PrimaryGeneratedColumn({name: 'AuthorId'})
  authorId: number;

  @Column({ length: 50, name: 'AuthorCode' })
  authorCode: string;

  @Column({ length: 100, name: 'AuthorName' })
  authorName: string;

  @Column({ length: 20, name: 'Status' })
  status: string;
}
