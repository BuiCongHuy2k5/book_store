import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from './Account';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity({ name: 'employee' })
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  employeeCode: string;

  @Column()
  employeeName: string;

  @Column()
  gender: string;

  @Column()
  birthDate: Date;

  @Column()
  phone: string;

  @Column()
  address: string;

  @ManyToOne(() => Account, account => account.id, { onDelete: 'SET NULL', nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => Account)
  account: Account;

  @RelationId((employee: Employee) => employee.account)
  accountId: number;

  @Column({ length: 20, name: 'Status' })
  status: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    createdAt: Date;
  
  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;
}
