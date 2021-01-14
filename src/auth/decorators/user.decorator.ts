import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {AccessTokenPayload} from '../../interfaces';

export const GetUserPayload = createParamDecorator(
    (data: string, context: ExecutionContext): AccessTokenPayload => {
        const {req} = GqlExecutionContext.create(context).getContext();
        return data ? req?.['user']?.[data] : req?.['user'];
    },
);
