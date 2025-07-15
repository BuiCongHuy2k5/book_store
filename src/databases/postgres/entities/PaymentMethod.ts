import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'PaymentMethod' })
export class PaymentMethod {
  @PrimaryGeneratedColumn({ name: 'PaymentMethodId' })
  paymentMethodId: number;

  @Column({ name: 'Name', length: 50 })
  name: string;
}
