import { Test, TestingModule } from '@nestjs/testing';
import { PartResolver } from './part.resolver';
import { PartService } from './part.service';

describe('PartResolver', () => {
  let resolver: PartResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartResolver, PartService],
    }).compile();

    resolver = module.get<PartResolver>(PartResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
