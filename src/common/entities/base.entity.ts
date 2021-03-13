import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
  Unique,
} from 'typeorm';
import { ObjectType, HideField } from '@nestjs/graphql';

@ObjectType()
@Unique(['id'])
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @HideField()
  @PrimaryGeneratedColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: string;

  @UpdateDateColumn()
  dateUpdated: string;
}
