import { Module } from '@nestjs/common';
import { PartService } from './part.service';
import { PartResolver } from './part.resolver';
import { FileModule } from '../file';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Part } from './part.entity';
import { PartEventService } from './part-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Part]), FileModule],
  providers: [PartResolver, PartService, PartEventService],
  exports: [PartService, PartEventService],
})
export class PartModule {}
