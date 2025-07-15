import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Account' })
export class Account {
  @PrimaryGeneratedColumn({ name: "AccountId" })
  accountId: number;

  @Column({ length: 100, name: "Username" })
  username: string;

  @Column({ length: 100, name: "Password" })
  password: string;

  @Column({ length: 50, name: "Role" })
  role: string;

  @Column({ length: 20, name: "Status" })
  status: string;
}
