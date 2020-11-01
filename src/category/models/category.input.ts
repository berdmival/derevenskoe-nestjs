import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CategoryInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ defaultValue: true })
  enabled: boolean;
}
