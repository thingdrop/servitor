import { IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name: string;

  @IsNumber()
  size: number;
}
