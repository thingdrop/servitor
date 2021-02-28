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

    const createFilesDto = files.map((file) => {
      const key = this.fileService.createFileKey(file.name);
      return {
        modelId: model.id,
        name: file.name,
        key,
        isPrimary: file.isPrimary,
      };
    });

    await this.fileService.createFiles(createFilesDto);

    const savedFiles = await this.getModelFiles(model.id);

    const filesResponse = savedFiles.map((file) => {
      const key = this.fileService.createFileKey(file.name);
      const contentType = this.fileService.getContentType(file.name);
      const postPolicy = this.fileService.createPresignedPostRequest({
        metadata: { modelId: model.id },
        key,
        contentType,
        expires: 60 * 60,
      });

      return {
        ...file,
        contentType,
        postPolicy,
      };
    });

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
