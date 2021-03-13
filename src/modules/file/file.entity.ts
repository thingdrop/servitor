import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsUrl, IsObject, IsHash } from 'class-validator';
import graphqlTypeJson from 'graphql-type-json';
import { BaseEntity } from '../../common/entities';
import { Model } from '../model/model.entity';
import { FileStatus } from './types';
import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType('File')
@Entity()
export class File extends BaseEntity {
  /* Relations */
  @ManyToOne(() => Model, (model) => model.files)
  @JoinColumn({ referencedColumnName: 'id' })
  model: Model;

  @Column()
  @IsString()
  modelId: string;

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

  // @HideField()
  @Column({ nullable: true })
  @IsString()
  key: string;

  // @HideField()
  @Column({ nullable: true })
  @IsString()
  bucket: string;

  // @HideField()
  @Column({ nullable: true })
  @IsHash('md5')
  eTag: string;

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsObject()
  postPolicy?: any;

  @IsString()
  contentType?: string;

  @IsUrl()
  downloadUrl?: string;
}
