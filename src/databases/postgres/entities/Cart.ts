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
import { Customer } from './Customer';
import { Account } from './Account';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Book } from './Book';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  cartCode: string;

  @ManyToOne(() => Customer, customer => customer.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Account, account => account.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Account)
  account: Account;

  @RelationId((cart: Cart) => cart.account)
  accountId: number;

  @ManyToOne(() => Book, book => book.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Book)
  book: Book;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({ type: 'decimal' })
  totalAmount: number;
}
