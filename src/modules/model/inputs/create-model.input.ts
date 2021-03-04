import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsString,
  Length,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ModelLicense } from '../types';

registerEnumType(ModelLicense, {
  name: 'ModelLicense',
});

@InputType()
export class CreateModelInput {
  @IsString()
  @Length(4, 20)
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isPrivate: boolean;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Field(() => ModelLicense)
  @IsString()
  @IsEnum(ModelLicense)
  @IsOptional()
  license?: ModelLicense;
}
