import { CreatePartInput } from './create-part.input';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { InputType, PartialType } from '@nestjs/graphql';
import { PartStatus } from '../types';

@InputType()
export class UpdatePartInput extends PartialType(CreatePartInput) {
  @IsString()
  @IsOptional()
  @IsEnum(PartStatus)
  status?: string;

  @IsUUID()
  @IsOptional()
  fileId?: string;
}
