import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFileDto {
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
