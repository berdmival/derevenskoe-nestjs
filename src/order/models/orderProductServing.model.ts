import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Product} from '../../product/models/product.model';

@ObjectType()
export class OrderProductServing {
    @Field(type => ID, {nullable: true})
    id: number;

    @Field(type => Int)
    count: number;

    @Field(type => Product)
    product: Product;

    @Field(type => Int)
    costOfOrderProductServing: number;
}
