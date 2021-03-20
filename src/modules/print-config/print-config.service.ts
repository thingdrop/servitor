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

  async create(createPrintConfigInput: CreatePrintConfigInput) {
    const printConfig = this.printConfigRepository.create(
      createPrintConfigInput,
    );
    return this.printConfigRepository.save(printConfig);
  }

  async getById(id: string) {
    const printConfig = await this.printConfigRepository.findOne({
      where: { id },
    });
    if (!printConfig) {
      throw new NotFoundException();
    }
    return printConfig;
  }

  async update(id: string, updatePrintConfigInput: UpdatePrintConfigInput) {
    const printConfig = await this.getById(id);
    const updatedPrintConfig = Object.assign(
      printConfig,
      updatePrintConfigInput,
    );
    await this.printConfigRepository.save(updatedPrintConfig);
    return updatedPrintConfig;
  }
}
