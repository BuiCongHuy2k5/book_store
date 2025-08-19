import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'author' })
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  authorCode: string;

  @Column()
  authorName: string;

  @Column({ nullable: true, default: null })
  birtDate: Date;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable:true })
    createdAt: Date;
  
  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;
}
