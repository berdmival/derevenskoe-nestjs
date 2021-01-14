import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {AuthData} from '../../interfaces';

export const GetCredentials = createParamDecorator(
    (data: string, context: ExecutionContext): AuthData => {
        const {req} = GqlExecutionContext.create(context).getContext();
        return data ? req?.['credentials']?.[data] : req?.['credentials'];
    },
);
