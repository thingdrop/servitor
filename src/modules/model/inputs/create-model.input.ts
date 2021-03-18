import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  Length,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { CreatePartInput } from '../../part';
import { ModelLicense } from '../types';

registerEnumType(ModelLicense, {
  name: 'ModelLicense',
});

@InputType()
export class CreateModelInput {
  @IsOptional()
  @IsString()
  @Length(4, 20)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Field(() => ModelLicense)
  @IsString()
  @IsEnum(ModelLicense)
  @IsOptional()
  license?: ModelLicense;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreatePartInput)
  parts: CreatePartInput[];
}
