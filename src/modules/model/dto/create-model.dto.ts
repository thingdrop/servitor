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

export class CreateModelDto {
  @IsString()
  @Length(4, 20)
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isPrivate: boolean;

  /* Optional Fields */
  /* ABS, PLA, etc */
  @IsString()
  @IsEnum(ModelFilament)
  @IsOptional()
  filamentType?: ModelFilament;

  /* Number of individual printable parts a model contains */
  @IsInt()
  @Min(0)
  @IsOptional()
  numParts?: number;

  /* Layer height - 0.1mm and up */
  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  resolution?: number;

  /* Percentage infill recommended - 0-100 */
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  infill?: number;

  /* What type of supports should be used */
  @IsString()
  @IsEnum(ModelSupportsType)
  @IsOptional()
  supportType?: ModelSupportsType;

  /* Where supports should be added */
  @IsString()
  @IsEnum(ModelSupports)
  @IsOptional()
  supportLocation?: ModelSupports;

  /* Temperature to print the model - largely material/printer dependent */
  @IsInt()
  @Min(0)
  @Max(1000)
  @IsOptional()
  printTemp?: number;

  /* Type of build plate adhesion recommended - Skirt, brim, raft, etc */
  @IsString()
  @IsEnum(ModelBuildPlateAdhesion)
  @IsOptional()
  buildPlateAdhesion?: ModelBuildPlateAdhesion;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @IsString()
  @IsEnum(ModelLicense)
  @IsOptional()
  license?: ModelLicense;

  // TODO How do we want to handle this? Model ID?
  /* If this model is a remix of another model, point us to that model */
  @IsString()
  @IsOptional()
  remixOf?: string;

  /* Secondary description for any other print recommendations we don't have support for */
  @IsString()
  @IsOptional()
  otherDescription?: string;
}
