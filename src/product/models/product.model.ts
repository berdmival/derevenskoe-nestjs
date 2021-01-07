import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../../category/models/category.model';

@ObjectType()
export class Product {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(type => Int, {
    defaultValue: 0,
    description: "product's price in kopecks",
  })
  price: number;

  @Field(type => Float, { defaultValue: 1.0 })
  coefficient: number;

  @Field({ defaultValue: true })
  advisable: boolean;

  @Field({ defaultValue: true })
  enabled: boolean;

  @Field(type => [String], { nullable: 'itemsAndList' })
  picturesNames: string[];

  @Field(type => Int)
  costOfServing: number;

  @Field(type => Category, { nullable: true })
  category: Category;
}
