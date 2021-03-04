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
import { PrintConfigService, UpdatePrintConfigInput } from '../print-config';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    private fileService: FileService,
    private printConfigService: PrintConfigService,
    private jwtService: JwtService,
  ) {}

  async createModel(createModelInput: CreateModelInput): Promise<any> {
    const model = this.modelRepository.create(createModelInput);

    model.status = ModelStatus.CREATED;
    /* Create an empty printConfig by default */
    model.printConfig = this.printConfigService.createPrintConfig({});
    await this.modelRepository.save(model);

    const tokenPayload = {
      modelId: model.id,
      action: 'UPLOAD',
    };
    model.uploadToken = this.jwtService.signToken(tokenPayload, {
      expiresIn: process.env.UPLOAD_TOKEN_EXPIRATION,
    });

    return model;
  }

  async createModelFile(id, createFileInput: CreateFileInput): Promise<File> {
    const model = await this.getModelById(id);
    const file = await this.fileService.createFile(model, createFileInput);
    return file;
  }

  async getModels(filterInput: GetModelsFilterInput): Promise<any> {
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

  getModelFile(id: string): Promise<File> {
    return this.fileService.getFileByModelId(id);
  }

  async getModelById(id: string): Promise<Model> {
    const model = await this.modelRepository.findOne({
      where: { id },
      relations: ['file', 'printConfig'],
    });
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  saveModel(model: Model) {
    return this.modelRepository.save(model);
  }

  async updateModelPrintConfig(
    id: string,
    updatePrintConfigInput: UpdatePrintConfigInput,
  ) {
    const model = await this.getModelById(id);
    const printConfig = await this.printConfigService.create(
      model,
      updatePrintConfigInput,
    );
    model.printConfig = printConfig;
    return model;
  }

  async updateModel(id: string, updateModelInput: UpdateModelInput) {
    const model = await this.getModelById(id);
    const updatedModel = Object.assign(model, updateModelInput);
    await this.modelRepository.save(updatedModel);
    return updatedModel;
  }
}
