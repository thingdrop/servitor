import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { TokenExpiredError } from 'jsonwebtoken';
import { AUTH_OPTIONS } from './types';

const mockAuthOptions = {
  secret: 'test',
};

const mockId = 'e4a1e94a-4c10-4c9f-a51a-8612e7d9c06b';
const mockPaylood = {
  id: mockId,
};
const tokenPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

describe('JwtService', () => {
  let jwtService: JwtService;
  let validToken;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        { provide: AUTH_OPTIONS, useValue: mockAuthOptions },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  it('is defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('signToken', () => {
    it('returns a JWT token', () => {
      validToken = jwtService.signToken(mockPaylood, {
        expiresIn: 60,
      });
      expect(validToken).toMatch(tokenPattern);
    });
  });

  describe('verifyToken', () => {
    it('returns the payload if JWT is valid', () => {
      const result = jwtService.verifyToken(validToken);
      expect(result).toMatchObject(mockPaylood);
    });

    it('throws an exception if JWT is not valid', () => {
      const invalidToken = jwtService.signToken(mockPaylood, {
        expiresIn: 0,
      });
      expect(() => {
        jwtService.verifyToken(invalidToken);
      }).toThrow(TokenExpiredError);
    });
  });
});
