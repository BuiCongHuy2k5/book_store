import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './Book';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  inventoryCode: string;

  @ManyToOne(() => Book, book => book.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Book)
  book: Book;

  @Column()
  quantity: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  minThreshold: number;

  @Column()
  maxThreshold: number;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
