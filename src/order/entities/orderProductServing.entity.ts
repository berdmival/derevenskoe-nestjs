import {AfterLoad, BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import {OrderEntity} from './order.entity';
import {ProductEntity} from '../../product/entities/product.entity';

@Entity({name: 'OrderProductServings'})
export class OrderProductServingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: number;

    @ManyToOne(
        type => OrderEntity,
        order => order.servings,
    )
    order: OrderEntity;

    @ManyToOne(
        type => ProductEntity,
        product => product.servings,
    )
    product: ProductEntity;

    costOfOrderProductServing: number;

    @AfterLoad()
    countCostOfOrderProductServing() {
        this.costOfOrderProductServing = Math.round(
            this.product.costOfServing * this.count,
        );
    }
}
