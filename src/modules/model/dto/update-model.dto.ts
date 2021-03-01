import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsString } from 'class-validator';
import { CreateModelDto } from './create-model.dto';
import { ModelStatus } from '../types';

export class UpdateModelDto extends PartialType(CreateModelDto) {
  @IsString()
  @IsEnum(ModelStatus)
  status: string;
}
