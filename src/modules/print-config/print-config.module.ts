import { Module } from '@nestjs/common';
import { PrintConfigService } from './print-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintConfig } from './print-config.entity';
import PrintConfigResolver from './print-config.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PrintConfig])],
  controllers: [],
  providers: [PrintConfigService, PrintConfigResolver],
  exports: [PrintConfigService],
})
export class PrintConfigModule {}
