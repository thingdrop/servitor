import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsUrl, IsObject, IsHash } from 'class-validator';
import graphqlTypeJson from 'graphql-type-json';
import { BaseEntity } from '../../common/entities';
import { FileStatus } from './types';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Part } from '../part/part.entity';

@ObjectType('File')
@Entity()
export class File extends BaseEntity {
  /* Relations */
  @ManyToOne(() => Part, (part) => part.files)
  @JoinColumn({ referencedColumnName: 'id' })
  part: Part;

  @Column()
  @IsString()
  partId: string;

  /* Fields */
  @Column()
  @IsNumber()
  size: number;

  @Column()
  @IsUrl()
  @IsString()
  image: string;

  @HideField()
  @Column()
  @IsString()
  key: string;

  @HideField()
  @Column()
  @IsString()
  bucket: string;

  @HideField()
  @Column()
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
