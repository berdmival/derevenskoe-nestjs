import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Address } from './address.model';
import { OrderProductServing } from './orderProductServing.model';

@ObjectType()
export class Order {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field(type => GraphQLISODateTime)
  date: Date;

  @Field(type => User)
  user: User;

  @Field(type => Address)
  address: Address;

  @Field(type => [OrderProductServing])
  servings: OrderProductServing[];

  // orderStatus: OrderStatusEntity; // TODO order status

  @Field(type => Int)
  costOfOrder: number;
}
