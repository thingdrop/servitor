import { ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { File } from '../file';
import { ModelStatus, ModelLicense } from './types';
import { PrintConfig } from '../print-config';

@ObjectType('Model')
@Entity()
export class Model extends BaseEntity {
  /* Relations */
  @OneToOne(() => File, (file) => file.model)
  @JoinColumn({ referencedColumnName: 'id' })
  file?: File;

  @Exclude()
  @Column({ nullable: true })
  fileId: string;

  @OneToOne(() => PrintConfig, (printConfig) => printConfig.model, {
    cascade: true,
  })
  @JoinColumn({ referencedColumnName: 'id' })
  printConfig?: PrintConfig;

  @Exclude()
  @Column({ nullable: true })
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

  @Column({ nullable: true })
  @IsUrl()
  imagePreview?: string;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Column('enum', { enum: ModelLicense, nullable: true })
  @IsString()
  @IsOptional()
  license?: string;

  @Expose()
  @IsString()
  uploadToken?: string;
  model: Promise<PrintConfig>;
}
