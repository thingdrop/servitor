import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelService } from './model.service';
import { Model } from './model.entity';
import { FileModule } from '../file';
import { ModelResolver } from './model.resolver';
import { ModelHandlerService } from './model-handler.service';
import { AwsModule } from '../aws';
import { PrintConfigModule } from '../print-config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model]),
    FileModule,
    PrintConfigModule,
    AwsModule,
  ],
  providers: [ModelService, ModelResolver, ModelHandlerService],
  exports: [ModelService, ModelHandlerService],
  controllers: [],
})
export class ModelModule {}
