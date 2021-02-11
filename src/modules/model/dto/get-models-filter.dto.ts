import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ModelStatus } from '../types';

@InputType()
export class GetModelsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  search?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ModelStatus)
  @Field({ nullable: true })
  status?: string;

  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  page?: string;

  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  limit?: string;

  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  sortby?: string;

  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  orderby?: string;
}
