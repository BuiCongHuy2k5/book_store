import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId
} from 'typeorm';
import { Cart } from './Cart';
import { BookDetail } from './BookDetail';

@Entity({ name: 'CartDetail' })
export class CartDetail {
  @PrimaryGeneratedColumn({ name: 'CartDetailId' })
  cartDetailId: number;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'CartId' })
  cart: Cart;

  @RelationId((cd: CartDetail) => cd.cart)
  cartId: number;

  @ManyToOne(() => BookDetail)
  @JoinColumn({ name: 'BookDetailId' })
  bookDetail: BookDetail;

  @RelationId((cd: CartDetail) => cd.bookDetail)
  bookDetailId: number;

  @Column({ name: 'Quantity' })
  quantity: number;

  @Column('decimal', { precision: 18, scale: 2, name: 'UnitPrice' })
  unitPrice: number;
}
