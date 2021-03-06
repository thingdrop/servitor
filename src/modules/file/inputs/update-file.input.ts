import { InputType } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UpdateFileInput {
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
