import { Test, TestingModule } from '@nestjs/testing';
import { PrintConfigService } from './print-config.service';

describe('PrintConfigService', () => {
  let service: PrintConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintConfigService],
    }).compile();

    service = module.get<PrintConfigService>(PrintConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
