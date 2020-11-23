import { Field, InputType } from '@nestjs/graphql';
import { Role } from './role.model';

@InputType()
export class UserInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  phone: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  secondName: string;

  @Field({ nullable: true })
  patronymic: string;

  roles?: Role[];
}
