import { HideField, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsJWT,
  IsUUID,
} from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { File } from '../file';
import { ModelStatus, ModelLicense } from './types';
import { PrintConfig } from '../print-config';

@ObjectType('Model')
@Entity()
export class Model extends BaseEntity {
  /* Relations */
  @OneToMany(() => File, (file) => file.model)
  files?: File[];

  /* The current file's ID. Consumer should just use file */
  @HideField()
  @Column({ nullable: true })
  @IsUUID()
  fileId?: string;

  /* Resolve to the latest file*/
  file?: File;

  @OneToOne(() => PrintConfig, (printConfig) => printConfig.model)
  @JoinColumn({ referencedColumnName: 'id' })
  printConfig?: PrintConfig;

  @HideField()
  @Column({ nullable: true })
  @IsUUID()
  printConfigId: string;

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

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Column('enum', { enum: ModelLicense, nullable: true })
  @IsString()
  @IsOptional()
  license?: string;

  @IsJWT()
  accessToken?: string;
}
