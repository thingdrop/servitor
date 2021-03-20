import { InputType, PartialType } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { CreateFileInput } from './create-file.input';

@InputType()
export class UpdateFileInput extends PartialType(CreateFileInput) {
  @IsString()
  key: string;

  @IsNumber()
  size: number;

  @IsString()
  eTag: string;

  @IsString()
  bucket: string;

  @IsOptional()
  @IsString()
  sequencer: string;
}
