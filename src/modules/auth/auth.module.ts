import { Module, DynamicModule, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthModuleOptions, AUTH_OPTIONS } from './types';
import { JwtService } from './jwt.service';

export function AuthOptionsProvider(options) {
  return {
    provide: AUTH_OPTIONS,
    useValue: options,
  };
}

@Global()
@Module({})
export class AuthModule {
  static register(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [],
      controllers: [],
      providers: [AuthOptionsProvider(options), AuthService, JwtService],
      exports: [AuthOptionsProvider(options), AuthService, JwtService],
    };
  }
}
