import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
} from 'typeorm';
import { Customer } from './Customer';
import { Employee } from './Employee';

@Entity({ name: 'Invoice' })
export class Invoice {
  @PrimaryGeneratedColumn({ name: 'InvoiceId' })
  invoiceId: number;

  @Column({ name: 'InvoiceCode', length: 50 })
  invoiceCode: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'CustomerId' })
  customer: Customer;

  @RelationId((invoice: Invoice) => invoice.customer)
  customerId: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'EmployeeId' })
  employee: Employee;

  @RelationId((invoice: Invoice) => invoice.employee)
  employeeId: number;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'  })
  updatedAt: Date;

  @Column({ name: 'TotalAmount', type: 'decimal', precision: 18, scale: 2 })
  totalAmount: number;

  @Column({ name: 'BookName', length: 100 })
  bookName: string; //lưu dữ liệu tĩnh trong các nghiệp vụ như hóa đơn

  @Column({ name: 'Status', length: 20 })
  status: string;
}
