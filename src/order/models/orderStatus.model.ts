import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrderStatus {
    @Field(type => ID, {nullable: true})
    id: number;

    @Field()
    name: string;
}
