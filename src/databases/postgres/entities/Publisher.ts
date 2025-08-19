import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'publisher' })
export class Publisher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  publisherCode: string;

  @Column()
  publisherName: string;

  @Column()
  status: string;

  @Column()
  Adress: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable:true })
    createdAt: Date;
  
  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;
}
