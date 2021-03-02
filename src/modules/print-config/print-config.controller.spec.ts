import { Test, TestingModule } from '@nestjs/testing';
import { PrintConfigController } from './print-config.controller';
import { PrintConfigService } from './print-config.service';

describe('PrintConfigController', () => {
  let controller: PrintConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintConfigController],
      providers: [PrintConfigService],
    }).compile();

    controller = module.get<PrintConfigController>(PrintConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
