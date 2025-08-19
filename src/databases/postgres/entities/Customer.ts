import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from './Account';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  customerCode: string;

  @Column()
  customerName: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @ManyToOne(() => Account, account => account.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Account)
  account: Account;

  @RelationId((customer: Customer) => customer.account)
  accountId: number;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',nullable:true })
    createdAt: Date;
  
  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable:true })
  updatedAt: Date;
}
