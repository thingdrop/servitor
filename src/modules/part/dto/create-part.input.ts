import { InputType } from '@nestjs/graphql';
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class CreatePartInput {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(262144000)
  size: number;
}
