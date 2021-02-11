import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
  Generated,
  Column,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ObjectType, HideField, Field } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @Exclude()
  @HideField()
  @PrimaryGeneratedColumn()
  _id: string;

  @Field()
  @Column()
  @Generated('uuid')
  id: string;

  @Field()
  @CreateDateColumn()
  dateCreated: string;

  @Field()
  @UpdateDateColumn()
  dateUpdated: string;
}
