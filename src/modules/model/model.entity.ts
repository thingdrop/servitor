import { Entity, Column, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { File } from '../file/file.entity';
import {
  ModelStatus,
  ModelFilament,
  ModelSupports,
  ModelSupportsType,
  ModelBuildPlateAdhesion,
  ModelLicense,
} from './types';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Model')
@Entity()
export class Model extends BaseEntity {
  /* Relations */
  @OneToMany(() => File, (file) => file.model)
  @Field(() => [File])
  files?: File[];

  /* Fields */
  @Field()
  @Column()
  @IsString()
  name: string;

  @Field()
  @Column()
  @IsString()
  description: string;

  @Field()
  @Column('enum', { enum: ModelStatus, default: ModelStatus.CREATED })
  @IsString()
  status: string;

  @Field()
  @Column()
  @IsBoolean()
  canDownload: boolean;

  @Field()
  @Column({ nullable: true })
  @IsUrl()
  imagePreview: string;

  @Field({ nullable: true })
  @Expose()
  @IsString()
  uploadToken?: string;

  /* Optional Fields */
  /* ABS, PLA, etc */
  @Field({ nullable: true })
  @Column('enum', { enum: ModelFilament, nullable: true })
  @IsString()
  @IsOptional()
  filamentType?: string;

  /* Number of individual printable parts a model contains */
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  numParts?: number;

  /* Layer height - 0.1mm and up */
  @Field({ nullable: true })
  @Column({ nullable: true, type: 'decimal' })
  @IsNumber()
  @IsOptional()
  resolution?: number;

  /* Percentage infill recommended - 0-100 */
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  infill?: number;

  /* Where supports should be added */
  @Field({ nullable: true })
  @Column('enum', { enum: ModelSupports, nullable: true })
  @IsString()
  @IsOptional()
  supports?: string;

  /* What type of supports should be used */
  @Field({ nullable: true })
  @Column('enum', { enum: ModelSupportsType, nullable: true })
  @IsString()
  @IsOptional()
  supportType?: string;

  /* Temperature to print the model - largely material/printer dependent */
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  printTemp?: number;

  /* Type of build plate adhesion recommended - Skirt, brim, raft, etc */
  @Field({ nullable: true })
  @Column('enum', { enum: ModelBuildPlateAdhesion, nullable: true })
  @IsString()
  @IsOptional()
  buildPlateAdhesion?: string;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Field({ nullable: true })
  @Column('enum', { enum: ModelLicense, nullable: true })
  @IsString()
  @IsOptional()
  license?: string;

  // TODO How do we want to handle this? Model ID?
  /* If this model is a remix of another model, point us to that model */
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  remixOf?: string;

  /* Secondary description for any other print recommendations we don't have support for */
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  otherDescription?: string;
}
