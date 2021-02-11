import { Injectable, Inject } from '@nestjs/common';
import { AuthModuleOptions, AUTH_OPTIONS } from './types';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_OPTIONS) private options: AuthModuleOptions,
    private jwtService: JwtService,
  ) {}
}
