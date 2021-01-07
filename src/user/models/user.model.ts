import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from './role.model';
import { Address } from '../../order/models/address.model';

@ObjectType()
export class User {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field()
  name: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  secondName: string;

  @Field({ nullable: true })
  patronymic: string;

  @Field({ nullable: true })
  pictureName: string;

  @Field({ defaultValue: true })
  enabled: boolean;

  @Field(type => [Role], { nullable: 'itemsAndList' })
  roles: Role[];

  @Field(type => [Address], { nullable: 'itemsAndList' })
  addresses: Address[];
}
