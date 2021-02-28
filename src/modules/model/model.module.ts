import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelService } from './model.service';
import { Model } from './model.entity';
import { FileModule } from '../file';
import { ModelController } from './model.controller';
import { ModelHandlerService } from './model-handler.service';
import { AwsModule } from '../aws';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), FileModule, AwsModule],
  providers: [ModelService, ModelHandlerService],
  exports: [ModelService, ModelHandlerService],
  controllers: [ModelController],
})
export class ModelModule {}
