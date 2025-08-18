import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  cateCode: string;

  @Column()
  cateName: string;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',nullable:true })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;
}
