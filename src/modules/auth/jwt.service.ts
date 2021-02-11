import { Injectable, Inject } from '@nestjs/common';
import { verify, sign } from 'jsonwebtoken';
import { AUTH_OPTIONS, AuthModuleOptions } from './types';

@Injectable()
export class JwtService {
  constructor(@Inject(AUTH_OPTIONS) private options: AuthModuleOptions) {}
  signToken(payload: any, options) {
    const { secret } = this.options;
    const token = sign(payload, secret, options);
    return token;
  }

  verifyToken(token: string) {
    const { secret } = this.options;
    return verify(token, secret);
  }
}
