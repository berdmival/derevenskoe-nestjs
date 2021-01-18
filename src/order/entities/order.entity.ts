import {AfterLoad, BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';
import {UserEntity} from '../../user/entities/user.entity';
import {AddressEntity} from './address.entity';
import {OrderProductServingEntity} from './orderProductServing.entity';
import {OrderStatusEntity} from "./orderStatus.entity";

@Entity({name: 'Orders'})
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string; // TODO: making date

    @ManyToOne(
        type => UserEntity,
        user => user.orders,
        {eager: true, onDelete: "CASCADE"}
    )
    user: UserEntity;

    @ManyToOne(
        type => AddressEntity,
        address => address.orders,
        {eager: true}
    )
    address: AddressEntity;

    @OneToMany(
        type => OrderProductServingEntity,
        ops => ops.order,
        {eager: true}
    )
    servings: OrderProductServingEntity[];

    @ManyToOne(
        type => OrderStatusEntity,
        ose => ose.orders,
        {eager: true}
    )
    orderStatus: OrderStatusEntity;

    costOfOrder: number;

    @AfterLoad()
    countCostOfOrder() {
        this.costOfOrder = Math.round(
            this?.servings?.reduce(
                (total, current) => total + current.costOfOrderProductServing,
                0,
            ),
        );
    }
}
