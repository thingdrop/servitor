import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateModelInput } from './create-model.input';
import { ModelStatus } from '../types';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateModelInput extends PartialType(CreateModelInput) {
  @IsString()
  @IsOptional()
  @IsEnum(ModelStatus)
  status?: string;
}
