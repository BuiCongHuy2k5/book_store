import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Account } from './Account';

@Entity({ name: 'Customer' })
export class Customer {
  @PrimaryGeneratedColumn({name: "CustomerId"})
  customerId: number;

  @Column({ length: 50, name: "CustomerCode" })
  customerCode: string;

  @Column({ length: 100, name: "CustomerName" })
  customerName: string;

  @Column({ length: 10, name: "Gender" })
  gender: string;

  @Column({length: 11, name: "Phone" })
  phone: string;

  @Column({ length: 100, name: "Email" })
  email: string;

  @Column({ length: 255, name: "Address" })
  address: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'AccountId' })
  account: Account;

  @RelationId((customer: Customer) => customer.account)
  accountId: number;

  @Column({ length: 20, name: "Status" })
  status: string;
}
