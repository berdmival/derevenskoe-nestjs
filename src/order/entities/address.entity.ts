import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'Addresses' })
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  coordinates: string;

  @Column({ nullable: true })
  formatted: string;

  @ManyToMany(type => UserEntity)
  user: UserEntity[];

  @OneToMany(
    type => OrderEntity,
    order => order.address,
  )
  orders: OrderEntity[];
}
