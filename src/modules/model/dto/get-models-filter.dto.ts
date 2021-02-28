import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ModelStatus } from '../types';

export class GetModelsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search?: string;

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
