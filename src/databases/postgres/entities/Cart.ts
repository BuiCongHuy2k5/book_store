import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './Customer';
import { Account } from './Account';

@Entity({ name: 'Cart' })
export class Cart {
  @PrimaryGeneratedColumn({ name: 'CartId' })
  cartId: number;

  @Column({ length: 50, name: 'CartCode' })
  cartCode: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'CustomerId' })
  customer: Customer;

  @RelationId((cart: Cart) => cart.customer)
  customerId: number;

  @Column({ length: 20, name: 'Status' })
  status: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
createdAt: Date;

@UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
updatedAt: Date;


  @ManyToOne(() => Account)
  @JoinColumn({ name: 'AccountId' })
  account: Account;

  @RelationId((cart: Cart) => cart.account)
  accountId: number;
}
