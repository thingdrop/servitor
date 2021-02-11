import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const tokenPattern = /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

function getTokenFromRequest(request) {
  const headerValue = request.headers.authorization;
  if (tokenPattern.test(headerValue)) {
    const token = headerValue.replace('Bearer ', '');
    return token;
  }
  return null;
}

export const GetToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return getTokenFromRequest(req);
  },
);
