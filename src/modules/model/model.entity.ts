import { HideField, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { ModelStatus, ModelLicense } from './types';
import { PrintConfig } from '../print-config';
import { Part } from '../part';

@ObjectType('Model')
@Entity()
export class Model extends BaseEntity {
  /* Relations */
  @OneToMany(() => Part, (part) => part.model)
  parts?: Part[];

  @OneToOne(() => PrintConfig, (printConfig) => printConfig.model)
  @JoinColumn({ referencedColumnName: 'id' })
  printConfig?: PrintConfig;

  @HideField()
  @Column({ nullable: true })
  @IsUUID()
  printConfigId: string;

  /* Fields */
  @Column({ default: '' })
  @IsString()
  name: string;

  @Column({ default: '' })
  @IsString()
  description: string;

  @Column('enum', { enum: ModelStatus, default: ModelStatus.CREATED })
  @IsString()
  status: string;

  @Column({ default: false })
  @IsBoolean()
  isPrivate: boolean;

  /* Model usage/remix restrictions - MIT, Apache, etc */
  @Column('enum', { enum: ModelLicense, nullable: true })
  @IsString()
  @IsOptional()
  license?: string;

  // @IsJWT()
  // accessToken?: string;
}
