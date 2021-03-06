import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const tokenPattern = /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

function getTokenFromRequest(request) {
  const headerValue = request.headers.authorization;
  if (tokenPattern.test(headerValue)) {
    const token = headerValue.replace('Bearer ', '');
    return token;
  }
  return null;
}

export const Token = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.token;
  },
);
