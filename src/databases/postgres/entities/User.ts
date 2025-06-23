import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(of => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({nullable: true})
  @Field()
  email: string;

  @Column({nullable: true})
  @Field()
  phoneNumber: string;

  @Column({ nullable: true })
  passWord: string;

  @Column({ nullable: true, unique: true })
  @Field({ nullable: true })
  userName: string;
  

  @Column({ nullable: true })
  @Field({ nullable: true })
  genDer: string;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  birtDate: Date;
}
