import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Address {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field()
  coordinates: string;

  @Field()
  formatted: string;
}
