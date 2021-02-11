import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Model } from './model.entity';
import { CreateModelDto, AddFilesDto, GetModelsFilterDto } from './dto';
import { ModelStatus } from './types';
import { JwtService } from '../auth';
import { File, FileService } from '../file';
import { CreateModelInput } from './inputs';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    private fileService: FileService,
    private jwtService: JwtService,
  ) {}

  async createModel(createModelDto: CreateModelDto): Promise<any> {
    const model = this.modelRepository.create(createModelDto);
    model.status = ModelStatus.CREATED;
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

  async createModel2(createModelInput: CreateModelInput): Promise<any> {
    const model = this.modelRepository.create(createModelInput);
    model.status = ModelStatus.CREATED;
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

  async addModelFiles(id: string, addFilesDto: AddFilesDto) {
    const model = await this.getModelById(id);
    const { files } = addFilesDto;

    /* For each file, prepare a createFileDto, and a response (including postPolicy)*/
    const { createFilesDto, filesResponse } = files.reduce(
      (map, fileObj) => {
        const key = this.fileService.createFileKey(fileObj.name);
        const contentType = this.fileService.getContentType(fileObj.name);
        const postPolicy = this.fileService.createPresignedPostRequest({
          metadata: { modelId: model.id },
          key,
          contentType,
          expires: 60 * 60,
        });
        /* Add file to array of files to be saved to DB */
        map.createFilesDto.push({
          modelId: model.id,
          name: fileObj.name,
          key,
          isPrimary: fileObj.isPrimary,
        });
        /* Add file to upload response */
        map.filesResponse.push({
          name: fileObj.name,
          contentType,
          postPolicy,
          isPrimary: fileObj.isPrimary,
        });
        return map;
      },
      { createFilesDto: [], filesResponse: [] },
    );

    await this.fileService.createFiles(createFilesDto);

    return filesResponse;
  }

  async getModels(filterDto: GetModelsFilterDto): Promise<any> {
    const { search, status, page, limit, sortby, orderby } = filterDto;

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

  getModelFiles(id: string): Promise<File[]> {
    return this.fileService.getFilesByModelId(id);
  }

  async getModelById(id: string): Promise<Model> {
    const model = await this.modelRepository.findOne({ where: { id } });
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  saveModel(model: Model) {
    return this.modelRepository.save(model);
  }
}
