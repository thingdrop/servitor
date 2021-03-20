import { InputType } from '@nestjs/graphql';
import { IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateFileInput {
  @IsUUID()
  partId: string;

  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsString()
  key: string;

  @IsString()
  contentType: string;
}
