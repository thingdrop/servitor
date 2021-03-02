import { Entity, Column, OneToOne } from 'typeorm';
import { IsString, IsNumber, IsUrl, IsObject } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { Model } from '../model/model.entity';
import { Exclude, Expose } from 'class-transformer';
import { FileStatus } from './types';

@Entity()
export class File extends BaseEntity {
  /* Relations */
  @OneToOne(() => Model, (model) => model.file)
  model: Model;

  // @Column()
  // modelId: string;

  /* Fields */
  @Column()
  @IsString()
  name: string;

  @Column('enum', { enum: FileStatus, default: FileStatus.CREATED })
  @IsString()
  status: string;

  @Column({ nullable: true })
  @IsNumber()
  size: number;

  @Column({ nullable: true })
  @IsUrl()
  @IsString()
  imagePreview?: string;

  @Exclude()
  @Column({ nullable: true })
  @IsString()
  key: string;

  @Exclude()
  @Column({ nullable: true })
  @IsString()
  bucket: string;

  @Exclude()
  @Column({ nullable: true })
  @IsString()
  eTag: string;

  @Expose()
  @IsObject()
  postPolicy?: any;

  @Expose()
  @IsString()
  contentType?: string;
}
