import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
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

@Entity()
export class Model extends BaseEntity {
  /* Relations */
  @OneToOne(() => File, (file) => file.model)
  @JoinColumn()
  file?: File;

  @Column({ nullable: true })
  fileId: string;

  /* Fields */
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column('enum', { enum: ModelStatus, default: ModelStatus.CREATED })
  @IsString()
  status: string;

  @Column()
  @IsBoolean()
  isPrivate: boolean;

  @Column({ nullable: true })
  @IsUrl()
  imagePreview: string;

  @Expose()
  @IsString()
  uploadToken?: string;

  /* Optional Fields */
  /* ABS, PLA, etc */
  @Column('enum', { enum: ModelFilament, nullable: true })
  @IsString()
  @IsOptional()
  filamentType?: string;

  /* Number of individual printable parts a model contains */
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  numParts?: number;

  /* Layer height - 0.1mm and up */
  @Column({ nullable: true, type: 'decimal' })
  @IsNumber()
  @IsOptional()
  resolution?: number;

  /* Percentage infill recommended - 0-100 */
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  infill?: number;

  /* Where supports should be added */
  @Column('enum', { enum: ModelSupports, nullable: true })
  @IsString()
  @IsOptional()
  supports?: string;

  /* What type of supports should be used */
  @Column('enum', { enum: ModelSupportsType, nullable: true })
  @IsString()
  @IsOptional()
  supportType?: string;

  /* Temperature to print the model - largely material/printer dependent */
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  printTemp?: number;

  /* Type of build plate adhesion recommended - Skirt, brim, raft, etc */
  @Column('enum', { enum: ModelBuildPlateAdhesion, nullable: true })
  @IsString()
  @IsOptional()
  buildPlateAdhesion?: string;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Column('enum', { enum: ModelLicense, nullable: true })
  @IsString()
  @IsOptional()
  license?: string;

  // TODO How do we want to handle this? Model ID?
  /* If this model is a remix of another model, point us to that model */
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  remixOf?: string;

  /* Secondary description for any other print recommendations we don't have support for */
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  otherDescription?: string;
}
