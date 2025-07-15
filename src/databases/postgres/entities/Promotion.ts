import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Promotion' })
export class Promotion {
  @PrimaryGeneratedColumn({ name: 'PromotionId' })
  promotionId: number;

  @Column({ name: 'PromotionCode', length: 50 })
  promotionCode: string;

  @Column({ name: 'PromotionName', length: 100 })
  promotionName: string;

  @Column({ name: 'StartDate', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'EndDate', type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'Quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'Status', length: 20 })
  status: string;
}
