import {
  IsString,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
class FileData {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  size: number;

  @Field()
  @IsBoolean()
  isPrimary: boolean;
}

@InputType()
export class AddFilesDto {
  @Field(() => [FileData])
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Type(() => FileData)
  files: FileData[];
}
