import { ObjectType, HideField, Field } from '@nestjs/graphql';
import { IsObject, IsString, IsUUID } from 'class-validator';
import { OneToMany, ManyToOne, JoinColumn, Column, Entity } from 'typeorm';
import graphqlTypeJson from 'graphql-type-json';
import { BaseEntity } from '../../common/entities';
import { File } from '../file';
import { Model } from '../model';
import { PartStatus } from './types';

@ObjectType('Part')
@Entity()
export class Part extends BaseEntity {
  @ManyToOne(() => Model, (model) => model.parts)
  @JoinColumn({ referencedColumnName: 'id' })
  model: Model;

  @Column()
  @IsString()
  modelId: string;

  @OneToMany(() => File, (file) => file.part)
  files?: File[];

  /* The current file's ID. Consumer should just use file */
  @HideField()
  @Column({ nullable: true })
  @IsUUID()
  fileId?: string;

  /* Resolve to the latest file */
  file?: File;

  /* Fields */
  @Column()
  @IsString()
  name: string;

  @Column('enum', { enum: PartStatus, default: PartStatus.CREATED })
  @IsString()
  status: string;

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsObject()
  postPolicy?: any;
}
