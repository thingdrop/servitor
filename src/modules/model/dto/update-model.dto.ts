import { IsEnum, IsString } from 'class-validator';
import { ModelStatus } from '../types';

export class UpdateModelDto {
  @IsString()
  @IsEnum(ModelStatus)
  status: string;
}
