import { IsString, IsUUID, IsBoolean } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsUUID('4')
  modelId: string;

  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsBoolean()
  isPrimary: boolean;
}
