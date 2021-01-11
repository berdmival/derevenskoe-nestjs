import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { AddressEntity } from '../../order/entities/address.entity';
import { OrderEntity } from '../../order/entities/order.entity';

@Entity({ name: 'Users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  secondName: string;

  @Column({ nullable: true })
  patronymic: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  pictureName: string;

  @Column({ nullable: false, default: true })
  enabled: boolean;

  @ManyToMany(() => RoleEntity, { eager: true })
  @JoinTable()
  roles: RoleEntity[];

  @ManyToMany(type => AddressEntity)
  @JoinTable()
  addresses: AddressEntity[];

  @OneToMany(
    type => OrderEntity,
    order => order.user,
  )
  orders: OrderEntity[];
}
