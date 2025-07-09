import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Category' })
export class Category {
  @PrimaryGeneratedColumn({ name: 'CategoryId' })
  categoryId: number;

  @Column({ type: 'varchar', length: 100, name: 'CategoryName' },)
  categoryName: string;

  @Column({ type: 'varchar', length: 20, name: 'Status' })
  status: string;
}
