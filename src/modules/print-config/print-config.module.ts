import { Module } from '@nestjs/common';
import { PrintConfigService } from './print-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintConfig } from './print-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintConfig])],
  controllers: [],
  providers: [PrintConfigService],
  exports: [PrintConfigService],
})
export class PrintConfigModule {}
