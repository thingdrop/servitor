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
import { JwtService } from '../auth';
import { CreateFileInput, File, FileService } from '../file';
import { PrintConfigService } from '../print-config';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    private fileService: FileService,
    private printConfigService: PrintConfigService,
    private jwtService: JwtService,
  ) {}

  async create(createModelInput: CreateModelInput): Promise<Model> {
    const model = this.modelRepository.create(createModelInput);

    model.status = ModelStatus.CREATED;
    /* Create an empty printConfig by default */
    model.printConfig = await this.printConfigService.create({});
    await this.modelRepository.save(model);

    const tokenPayload = {
      modelId: model.id,
      action: 'UPLOAD',
    };
    model.accessToken = this.jwtService.signToken(tokenPayload, {
      expiresIn: process.env.UPLOAD_TOKEN_EXPIRATION,
    });

    return model;
  }

  async createModelFile(
    token: any,
    modelId: string,
    createFileInput: CreateFileInput,
  ): Promise<File> {
    /* Verify that the modelId in the accessToken matches the provided model ID */
    if (token.modelId !== modelId) {
      throw new NotFoundException();
    }

    return this.fileService.create(modelId, createFileInput);
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
      relations: ['files', 'printConfig'],
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
