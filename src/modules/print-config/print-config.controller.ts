import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PrintConfigService } from './print-config.service';
import { CreatePrintConfigDto } from './dto/create-print-config.dto';
import { UpdatePrintConfigDto } from './dto/update-print-config.dto';

@Controller('print-config')
export class PrintConfigController {
  constructor(private readonly printConfigService: PrintConfigService) {}

  @Post()
  create(@Body() createPrintConfigDto: CreatePrintConfigDto) {
    return this.printConfigService.create(createPrintConfigDto);
  }

  @Get()
  findAll() {
    return this.printConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printConfigService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrintConfigDto: UpdatePrintConfigDto,
  ) {
    return this.printConfigService.update(+id, updatePrintConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.printConfigService.remove(+id);
  }
}
