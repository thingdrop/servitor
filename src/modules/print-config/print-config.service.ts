import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from '../model';
import { CreatePrintConfigInput, UpdatePrintConfigInput } from './inputs';
import { PrintConfig } from './print-config.entity';

@Injectable()
export class PrintConfigService {
  constructor(
    @InjectRepository(PrintConfig)
    private printConfigRepository: Repository<PrintConfig>,
  ) {}
  async create(model: Model, createPrintConfigInput: CreatePrintConfigInput) {
    const printConfig = this.printConfigRepository.create(
      createPrintConfigInput,
    );
    printConfig.model = model;
    await this.printConfigRepository.save(printConfig);
    return printConfig;
  }

  createPrintConfig(createPrintConfigInput: CreatePrintConfigInput) {
    return this.printConfigRepository.create(createPrintConfigInput);
  }

  async getPrintConfigById(id: string) {
    const printConfig = await this.printConfigRepository.findOne({
      where: { id },
    });
    if (!printConfig) {
      throw new NotFoundException();
    }
    return printConfig;
  }

  findAll() {
    return `This action returns all printConfig`;
  }

  findOne(id: string) {
    return `This action returns a #${id} printConfig`;
  }

  async update(id: string, updatePrintConfigInput: UpdatePrintConfigInput) {
    const printConfig = await this.getPrintConfigById(id);
    const updatedPrintConfig = Object.assign(
      printConfig,
      updatePrintConfigInput,
    );
    await this.printConfigRepository.save(updatedPrintConfig);
    return updatedPrintConfig;
  }

  remove(id: number) {
    return `This action removes a #${id} printConfig`;
  }
}
