import {Field, InputType} from '@nestjs/graphql';
import {AddressInput} from './address.input';
import {OrderProductServingInput} from './orderProductServing.input';

@InputType()
export class OrderInput {
    @Field(type => AddressInput)
    address: AddressInput;

    @Field(type => [OrderProductServingInput])
    servings: OrderProductServingInput[];
}
