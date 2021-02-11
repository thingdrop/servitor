import {
  Controller,
  UseInterceptors,
  Get,
  Param,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

@ApiTags('Files')
@Controller('files')
@UseInterceptors(ClassSerializerInterceptor)
export class FilesController {
  constructor(private fileService: FileService) {}

  @Get('/:id')
  downloadModelFile(@Param('id') id: string) {
    return this.fileService.downloadFile(id);
  }
}
