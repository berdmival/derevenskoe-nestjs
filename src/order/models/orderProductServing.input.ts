import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OrderProductServingInput {
  @Field(type => Int)
  count: number;

  @Field(type => ID)
  productId: number;
}
