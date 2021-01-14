import {Field, ID, ObjectType} from '@nestjs/graphql';
import {User} from './user.model';

@ObjectType()
export class Role {
    @Field(type => ID, {nullable: true})
    id: number;

    @Field()
    name: string;

    @Field(type => User)
    users: User[];
}
