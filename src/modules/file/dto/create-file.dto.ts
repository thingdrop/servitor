import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateFileDto {
  // @IsString()
  // @IsUUID('4')
  // modelId: string;

  @IsString()
  name: string;

  @IsNumber()
  size: number;
}
