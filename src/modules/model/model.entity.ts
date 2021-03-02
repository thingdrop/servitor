import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { File } from '../file';
import { ModelStatus, ModelLicense } from './types';
import { PrintConfig } from '../print-config';

@Entity()
export class Model extends BaseEntity {
  /* Relations */
  @OneToOne(() => File, (file) => file.model)
  @JoinColumn({ name: 'fileId' })
  file?: File;

  @OneToOne(() => PrintConfig, (printConfig) => printConfig.model, {
    eager: true,
  })
  @JoinColumn({ name: 'printConfigId' })
  printConfig?: PrintConfig;

  // @Column({ nullable: true })
  // fileId: string;

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

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Column('enum', { enum: ModelLicense, nullable: true })
  @IsString()
  @IsOptional()
  license?: string;

  @Expose()
  @IsString()
  uploadToken?: string;
}
