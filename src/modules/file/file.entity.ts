import { Entity, Column, OneToOne } from 'typeorm';
import { IsString, IsNumber, IsUrl, IsObject } from 'class-validator';
import graphqlTypeJson from 'graphql-type-json';
import { BaseEntity } from '../../common/entities';
import { Model } from '../model/model.entity';
import { Exclude, Expose } from 'class-transformer';
import { FileStatus } from './types';
import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType('File')
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

  @HideField()
  @Exclude()
  @Column({ nullable: true })
  @IsString()
  key: string;

  @HideField()
  @Exclude()
  @Column({ nullable: true })
  @IsString()
  bucket: string;

  @HideField()
  @Exclude()
  @Column({ nullable: true })
  @IsString()
  eTag: string;

  @Field(() => graphqlTypeJson, { nullable: true })
  @Expose()
  @IsObject()
  postPolicy?: any;

  @Expose()
  @IsString()
  contentType?: string;
}
