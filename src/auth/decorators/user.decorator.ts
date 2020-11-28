import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const { req } = GqlExecutionContext.create(context).getContext();
    return req['user'];
  },
);
