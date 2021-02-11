import { Entity, Column, ManyToOne } from 'typeorm';
import {
  IsString,
  IsNumber,
  IsUrl,
  IsBoolean,
  IsObject,
} from 'class-validator';
import graphqlTypeJson from 'graphql-type-json';
import { BaseEntity } from '../../common/entities';
import { Model } from '../model/model.entity';
import { Exclude, Expose } from 'class-transformer';
import { FileStatus } from './types';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

registerEnumType(FileStatus, {
  name: 'FileStatus',
});

@ObjectType('File')
@Entity()
export class File extends BaseEntity {
  /* Relations */
  @ManyToOne(() => Model, (model) => model.files)
  model: Model;

  @Field()
  @Column()
  modelId: string;

  /* Fields */
  @Field()
  @Column()
  @IsString()
  name: string;

  @Field()
  @Column('enum', { enum: FileStatus, default: FileStatus.CREATED })
  @IsString()
  @Field(() => FileStatus)
  status: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsNumber()
  size: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsBoolean()
  isPrimary: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsUrl()
  @IsString()
  imagePreview?: string;

  @Field({ nullable: true })
  @Exclude()
  @Column({ nullable: true })
  @IsString()
  key: string;

  @Field({ nullable: true })
  @Exclude()
  @Column({ nullable: true })
  @IsString()
  bucket: string;

  @Field({ nullable: true })
  @Exclude()
  @Column({ nullable: true })
  @IsString()
  eTag: string;

  @Field(() => graphqlTypeJson, { nullable: true })
  @Expose()
  @IsObject()
  postPolicy?: any;

  @Field({ nullable: true })
  @Expose()
  @IsString()
  contentType?: string;
}
