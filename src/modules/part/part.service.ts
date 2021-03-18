import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from '../file';
import { CreatePartInput } from './dto/create-part.input';
import { UpdatePartInput } from './dto/update-part.input';
import { Part } from './part.entity';
import { PartStatus } from './types';

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private partRepository: Repository<Part>,
    private fileService: FileService,
  ) {}

  async create(
    modelId: string,
    createPartInput: CreatePartInput,
  ): Promise<Part> {
    const part = this.partRepository.create(createPartInput);
    part.modelId = modelId;
    part.status = PartStatus.CREATED;

    const savedPart = await this.partRepository.save(part);

    const { id: partId } = savedPart;
    const key = this.fileService.createFileKey(savedPart.name);
    const postPolicy = this.fileService.createPresignedPostRequest({
      size: createPartInput.size,
      key,
      metadata: { modelId, partId },
      expires: 60 * 60,
    });

    part.postPolicy = postPolicy;
    return part;
  }

  async findById(id: string): Promise<Part> {
    const part = await this.partRepository.findOne({ where: { id } });
    if (!part) {
      throw new NotFoundException();
    }
    return part;
  }

  async findByModelId(modelId: string): Promise<Part> {
    const part = await this.partRepository.findOne({ where: { modelId } });
    if (!part) {
      throw new NotFoundException();
    }
    return part;
  }

  async findAllByModelId(modelId: string): Promise<Part[]> {
    const parts = await this.partRepository.find({ where: { modelId } });
    if (!parts.length) {
      throw new NotFoundException();
    }
    return parts;
  }

  async update(id: string, updatePartInput: UpdatePartInput) {
    const part = await this.findById(id);
    const updatedPart = Object.assign(part, updatePartInput);
    await this.partRepository.save(updatedPart);
    return updatedPart;
  }

  async getPartFile(partId: string) {
    const part = await this.findById(partId);
    const file = await this.fileService.downloadFile(part.fileId);
    return file;
  }
}
