import {
  Controller,
  Post,
  UseInterceptors,
  Get,
  Body,
  Param,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Model } from './model.entity';
import { ModelService } from './model.service';
import { FileGuard } from '../file/guards';
import { AddFilesDto, CreateModelDto, GetModelsFilterDto } from './dto';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('Models')
@Controller('models')
@UseInterceptors(ClassSerializerInterceptor)
export class ModelController {
  constructor(private modelService: ModelService) {}

  /* Subscribe to a model's status until COMPLETE (NOTE: Keep this above all other method definitions, or else bug) */
  @Sse('/:id/subscribe')
  sse(@Param('id') id: string): Observable<MessageEvent> {
    // Listen for when the Model (of :id) has its status column changed to 'COMPLETE'
    return interval(10000).pipe(
      map((_) => ({ data: { status: 'PROCESSING' } })),
    );
  }

  /* Create a model */
  @Post()
  createModel(@Body() createModelDto: CreateModelDto): Promise<Model> {
    return this.modelService.createModel(createModelDto);
  }

  /**
   * Create s3 POST Policies for each model file provided
   * Uploading files to a model should only be allowed:
   * 1. On creation of a model.
   * 2. On update of a model ONLY IF the user owns it.
   */
  @UseGuards(FileGuard)
  @Post('/:id/files')
  addModelFiles(
    @Param('id') id: string,
    @Body() addFilesDto: AddFilesDto,
  ): Promise<any> {
    return this.modelService.addModelFiles(id, addFilesDto);
  }

  /* Retrieve model's files */
  @Get('/:id/files')
  getModelFiles(@Param('id') id: string) {
    return this.modelService.getModelFiles(id);
  }

  /* Retrieve a model */
  @Get('/:id')
  getModelById(@Param('id') id: string): Promise<Model> {
    return this.modelService.getModelById(id);
  }

  /* Retrieve all or subset of models */
  @Get()
  getModels(@Query() filterDto: GetModelsFilterDto): Promise<Model[]> {
    return this.modelService.getModels(filterDto);
  }
}
