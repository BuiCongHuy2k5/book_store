import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Publisher' })
export class Publisher {
  @PrimaryGeneratedColumn({name: 'PublisherId'})
  publisherId: number;

  @Column({ length: 50, name: 'PublisherCode' })
  publisherCode: string;

  @Column({ length: 100, name: 'PublisherName' })
  publisherName: string;

  @Column({ length: 20, name: 'Status' })
  status: string;
}