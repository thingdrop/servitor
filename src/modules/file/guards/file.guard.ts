import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../auth';

const tokenPattern = /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

function getTokenFromRequest(request) {
  const headerValue = request.headers.authorization;
  if (tokenPattern.test(headerValue)) {
    const token = headerValue.replace('Bearer ', '');
    return token;
  }
  return null;
}

@Injectable()
export class FileGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try {
      const token = getTokenFromRequest(request);
      const decodedToken = this.jwtService.verifyToken(token);
      request.token = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
