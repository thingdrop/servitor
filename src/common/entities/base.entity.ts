import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ObjectType, HideField } from '@nestjs/graphql';

@ObjectType()
@Unique(['id'])
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @HideField()
  @Exclude()
  @PrimaryGeneratedColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: string;

  @UpdateDateColumn()
  dateUpdated: string;
}
