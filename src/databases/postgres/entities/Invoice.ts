import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './Customer';
import { Employee } from './Employee';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Book } from './Book';

@Entity({ name: 'invoice' })
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  invoiceCode: string;

  @ManyToOne(() => Customer, customer => customer.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;

  @ManyToOne(() => Employee, employee => employee.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Employee)
  employee: Employee;

  @ManyToOne(() => Book, book => book.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Book)
  book: Book;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  totalAmount: number;

  @Column()
  status: string;
}
