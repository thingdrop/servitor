import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
  Generated,
  Column,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  _id: string;

  @Column()
  @Generated('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: string;

  @UpdateDateColumn()
  dateUpdated: string;
}
