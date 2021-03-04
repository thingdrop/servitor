import { InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateFileInput {
  @IsString()
  name: string;

  @IsNumber()
  size: number;
}
