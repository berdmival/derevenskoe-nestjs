import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class Category {
    @Field(type => ID, {nullable: true})
    id: number;

    @Field()
    name: string;

    @Field({nullable: true})
    description: string;

    @Field({nullable: true})
    pictureName: string;

    @Field({defaultValue: true})
    enabled: boolean;

    @Field(type => Category, {nullable: true})
    parentCategory: Category;

    @Field(type => [Category], {nullable: 'itemsAndList'})
    childCategories: Category[]

}
