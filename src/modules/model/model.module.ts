import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelService } from './model.service';
import { Model } from './model.entity';
import { ModelResolver } from './model.resolver';
import { AwsModule } from '../aws';
import { PrintConfigModule } from '../print-config';
import { PartModule } from '../part';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model]),
    PartModule,
    PrintConfigModule,
    AwsModule,
  ],
  providers: [ModelService, ModelResolver],
  exports: [ModelService],
  controllers: [],
})
export class ModelModule {}
