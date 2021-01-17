import {Field, GraphQLISODateTime, ID, Int, ObjectType,} from '@nestjs/graphql';
import {User} from '../../user/models/user.model';
import {Address} from './address.model';
import {OrderProductServing} from './orderProductServing.model';
import {OrderStatus} from "./orderStatus.model";

@ObjectType()
export class Order {
    @Field(type => ID, {nullable: true})
    id: number;

    @Field(type => GraphQLISODateTime)
    date: Date;

    @Field(type => User)
    user: User;

    @Field(type => Address)
    address: Address;

    @Field(type => OrderStatus)
    status: OrderStatus;

    @Field(type => [OrderProductServing])
    servings: OrderProductServing[];

    @Field(type => Int)
    costOfOrder: number;
}
