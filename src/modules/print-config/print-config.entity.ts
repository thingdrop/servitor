import { Column, Entity, OneToOne } from 'typeorm';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { Model } from '../model';
import {
  ModelBuildPlateAdhesion,
  ModelFilament,
  ModelSupports,
  ModelSupportsType,
} from '../model';

@Entity()
export class PrintConfig extends BaseEntity {
  /* Relations */
  @OneToOne(() => Model, (model) => model.printConfig)
  model: Model;

  /* Fields */
  /* ABS, PLA, etc */
  @Column('enum', { enum: ModelFilament, nullable: true })
  @IsString()
  @IsOptional()
  filamentType?: string;

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

  /* Secondary description for any other print recommendations we don't have support for */
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;
}
