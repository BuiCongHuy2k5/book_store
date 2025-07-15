import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Account } from './Account';

@Entity({ name: 'Employee' })
export class Employee {
  @PrimaryGeneratedColumn({name: "EmployeeId"})
  employeeId: number;

  @Column({ length: 50, name: "EmployeeCode" })
  employeeCode: string;

  @Column({ length: 100, name: "EmployeeName" })
  employeeName: string;

  @Column({ length: 10, name: "Gender" })
  gender: string;

  @Column({ type: 'date', name: "BirthDate" })
  birthDate: Date;

  @Column({ length: 11, name: "Phone" })
  phone: string;

  @Column({ length: 255, name: "Address" })
  address: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'AccountId' })
  account: Account;

  @RelationId((employee: Employee) => employee.account)
  accountId: number;

  @Column({ length: 20, name: "Status" })
  status: string;
}
