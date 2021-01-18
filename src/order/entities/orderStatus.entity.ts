import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';
import {OrderEntity} from "./order.entity";

@Entity({name: 'OrderStatuses'})
export class OrderStatusEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    name: string;

    @OneToMany(
        () => OrderEntity,
        order => order.orderStatus
    )
    orders: OrderEntity[];
}
