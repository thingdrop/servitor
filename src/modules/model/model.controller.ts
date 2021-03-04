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
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Model } from './model.entity';
import { ModelService } from './model.service';
import { FileGuard } from '../file/guards';
import {
  CreateModelInput,
  UpdateModelInput,
  GetModelsFilterInput,
} from './inputs';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileService, CreateFileInput } from '../file';

@ApiTags('Models')
@Controller('models')
@UseInterceptors(ClassSerializerInterceptor)
export class ModelController {
  constructor(
    private modelService: ModelService,
    private fileService: FileService,
  ) {}

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
  createModel(@Body() createModelInput: CreateModelInput): Promise<Model> {
    return this.modelService.createModel(createModelInput);
  }

  /**
   * Create s3 POST Policies for each model file provided
   * Uploading files to a model should only be allowed:
   * 1. On creation of a model.
   * 2. On update of a model ONLY IF the user owns it.
   */
  @UseGuards(FileGuard)
  @Post('/:id/file')
  createModelFile(
    @Param('id') id: string,
    @Body() createFileInput: CreateFileInput,
  ): Promise<any> {
    return this.modelService.createModelFile(id, createFileInput);
  }

  /* Retrieve a model */
  @Get('/:id')
  getModelById(@Param('id') id: string): Promise<Model> {
    return this.modelService.getModelById(id);
  }

  /* Retrieve all or subset of models */
  @Get()
  getModels(@Query() filterInput: GetModelsFilterInput): Promise<Model[]> {
    return this.modelService.getModels(filterInput);
  }

  @Get('/:id/file')
  getModelFile(@Param('id') id: string) {
    return this.modelService.getModelFile(id);
  }

  @Put('/:id')
  updateModel(
    @Param('id') id: string,
    @Body() updateModelInput: UpdateModelInput,
  ) {
    return this.modelService.updateModel(id, updateModelInput);
  }
}
