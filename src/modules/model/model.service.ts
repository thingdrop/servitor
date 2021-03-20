import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Model } from './model.entity';
import {
  CreateModelInput,
  UpdateModelInput,
  GetModelsFilterInput,
} from './inputs';
import { ModelStatus } from './types';
import { CreateFileInput, File } from '../file';
import { PrintConfigService } from '../print-config';
import { PartService } from '../part';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    private partService: PartService,
    private printConfigService: PrintConfigService,
  ) {}

  async create(createModelInput: CreateModelInput): Promise<Model> {
    const { parts, ...modelAttrs } = createModelInput;
    const model = this.modelRepository.create(modelAttrs);
    model.status = ModelStatus.CREATED;
    /* Create an empty printConfig by default */
    model.printConfig = await this.printConfigService.create({});
    const savedModel = await this.modelRepository.save(model);
    /* Create each part w/ a postPolicy */
    console.log({ createModelInput, parts });
    const createdParts = await Promise.all(
      parts.map((part) => this.partService.create(savedModel.id, part)),
    );
    savedModel.parts = createdParts;
    return savedModel;
  }

  async getModels(filterInput: GetModelsFilterInput): Promise<Model[]> {
    const { search, status, page, limit, sortby, orderby } = filterInput;

    const limitValue = parseInt(limit, 10) || 20;
    const pageValue = parseInt(page, 10) || 1;
    const take = limitValue;
    const skip = pageValue * limitValue - limitValue || 0;

    const query: any = {
      order: { [sortby || 'name']: orderby || 'DESC' },
      take,
      skip,
    };

    query.where = {};

    if (status) {
      query.where.status = status;
    }

    if (search) {
      query.where.name = Like(`%${search}%`);
    }

    const [results, total] = await this.modelRepository.findAndCount(query);
    return results;
    // TODO: figure out pagination implementation in gql
    // return {
    //   items: results,
    //   meta: {
    //     itemCount: results.length,
    //     totalItems: total,
    //     itemsPerPage: limitValue,
    //     currentPage: pageValue,
    //   },
    // };
  }

  async getById(id: string): Promise<Model> {
    const model = await this.modelRepository.findOne({
      where: { id },
      relations: ['parts', 'printConfig'],
    });
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  async update(id: string, updateModelInput: UpdateModelInput): Promise<Model> {
    const model = await this.getById(id);
    const updatedModel = Object.assign(model, updateModelInput);
    await this.modelRepository.save(updatedModel);
    return updatedModel;
  }
}
