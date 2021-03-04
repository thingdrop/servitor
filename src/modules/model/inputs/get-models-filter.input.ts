import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ModelStatus } from '../types';

registerEnumType(ModelStatus, {
  name: 'ModelStatus',
});

@InputType()
export class GetModelsFilterInput {
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @Field(() => ModelStatus)
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ModelStatus)
  status?: string;

  @IsOptional()
  @IsNotEmpty()
  page?: string;

  @IsOptional()
  @IsNotEmpty()
  limit?: string;

  @IsOptional()
  @IsNotEmpty()
  sortby?: string;

  @IsOptional()
  @IsNotEmpty()
  orderby?: string;
}
