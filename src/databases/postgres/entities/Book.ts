import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './Category';
import { Author } from './Author';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { Publisher } from './Publisher';

@Entity({ name: 'book' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  bookCode: string;

  @Column()
  bookName: string;

  @ManyToOne(() => Category, category => category.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Category)
  category: Category;

  @ManyToOne(() => Author, author => author.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Author)
  author: Author;

  @ManyToOne(() => Publisher, publisher => publisher.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Publisher)
  publisher: Publisher;

  @Column()
  status: string;

  @Column({ nullable: true, default: null })
  imageurl: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable:true})
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable:true })
  updatedAt: Date;
}
