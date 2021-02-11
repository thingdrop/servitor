import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsString,
  Length,
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import {
  ModelFilament,
  ModelSupports,
  ModelSupportsType,
  ModelBuildPlateAdhesion,
  ModelLicense,
} from '../types';

@InputType()
export class CreateModelInput {
  @Field()
  @IsString()
  @Length(4, 20)
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsBoolean()
  canDownload: boolean;

  /* Optional Fields */
  /* ABS, PLA, etc */
  @Field({ nullable: true })
  @IsString()
  @IsEnum(ModelFilament)
  @IsOptional()
  filamentType?: string;

  /* Number of individual printable parts a model contains */
  @Field({ nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  numParts?: number;

  /* Layer height - 0.1mm and up */
  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  resolution?: number;

  /* Percentage infill recommended - 0-100 */
  @Field({ nullable: true })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  infill?: number;

  /* Where supports should be added */
  @Field({ nullable: true })
  @IsString()
  @IsEnum(ModelSupports)
  @IsOptional()
  supports?: string;

  /* What type of supports should be used */
  @Field({ nullable: true })
  @IsString()
  @IsEnum(ModelSupportsType)
  @IsOptional()
  supportType?: string;

  /* Temperature to print the model - largely material/printer dependent */
  @Field({ nullable: true })
  @IsInt()
  @Min(0)
  @Max(1000)
  @IsOptional()
  printTemp?: number;

  /* Type of build plate adhesion recommended - Skirt, brim, raft, etc */
  @Field({ nullable: true })
  @IsString()
  @IsEnum(ModelBuildPlateAdhesion)
  @IsOptional()
  buildPlateAdhesion?: string;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Field({ nullable: true })
  @IsString()
  @IsEnum(ModelLicense)
  @IsOptional()
  license?: string;

  // TODO How do we want to handle this? Model ID?
  /* If this model is a remix of another model, point us to that model */
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  remixOf?: string;

  /* Secondary description for any other print recommendations we don't have support for */
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  otherDescription?: string;
}
