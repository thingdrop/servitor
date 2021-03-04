import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
  IsString,
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
} from '../types';

registerEnumType(ModelFilament, {
  name: 'ModelFilament',
});

registerEnumType(ModelSupports, {
  name: 'ModelSupports',
});

registerEnumType(ModelSupportsType, {
  name: 'ModelSupportsType',
});

registerEnumType(ModelBuildPlateAdhesion, {
  name: 'ModelBuildPlateAdhesion',
});

@InputType()
export class CreatePrintConfigInput {
  /* Optional Fields */
  /* ABS, PLA, etc */
  @IsString()
  @IsEnum(ModelFilament)
  @IsOptional()
  filamentType?: ModelFilament;

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
  @Field(() => ModelSupportsType)
  @IsString()
  @IsEnum(ModelSupportsType)
  @IsOptional()
  supportType?: ModelSupportsType;

  /* Where supports should be added */
  @Field(() => ModelSupports)
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
  @Field(() => ModelBuildPlateAdhesion)
  @IsString()
  @IsEnum(ModelBuildPlateAdhesion)
  @IsOptional()
  buildPlateAdhesion?: ModelBuildPlateAdhesion;

  /* Secondary description for any other print recommendations we don't have support for */
  @IsString()
  @IsOptional()
  notes?: string;
}
