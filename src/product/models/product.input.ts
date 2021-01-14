import {Field, Float, InputType, Int} from '@nestjs/graphql';

@InputType()
export class ProductInput {
    @Field()
    name: string;

    @Field({nullable: true})
    description: string;

    @Field(type => Int, {
        defaultValue: 0,
        description: "product's price in kopecks",
    })
    price: number;

    @Field(type => Float, {defaultValue: 1.0})
    coefficient: number;

    @Field({defaultValue: true})
    advisable: boolean;

    @Field({defaultValue: true})
    enabled: boolean;
}
