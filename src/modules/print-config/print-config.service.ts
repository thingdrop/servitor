import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrintConfigDto } from './dto/create-print-config.dto';
import { UpdatePrintConfigDto } from './dto/update-print-config.dto';
import { PrintConfig } from './print-config.entity';

@Injectable()
export class PrintConfigService {
  constructor(
    @InjectRepository(PrintConfig)
    private printConfigRepository: Repository<PrintConfig>,
  ) {}
  async create(createPrintConfigDto: CreatePrintConfigDto) {
    const printConfig = this.printConfigRepository.create(createPrintConfigDto);
    await this.printConfigRepository.save(printConfig);
    return printConfig;
  }

  findAll() {
    return `This action returns all printConfig`;
  }

  findOne(id: string) {
    return `This action returns a #${id} printConfig`;
  }

  update(id: number, updatePrintConfigDto: UpdatePrintConfigDto) {
    return `This action updates a #${id} printConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} printConfig`;
  }
}
