import { Module } from '@nestjs/common';
import { PrintConfigService } from './print-config.service';
import { PrintConfigController } from './print-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintConfig } from './print-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintConfig])],
  controllers: [PrintConfigController],
  providers: [PrintConfigService],
  exports: [PrintConfigService],
})
export class PrintConfigModule {}
