import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressInput {
  @Field()
  coordinates: string;

  @Field()
  formatted: string;
}
