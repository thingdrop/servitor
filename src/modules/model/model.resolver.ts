import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ModelService } from './model.service';
import { Model } from './model.entity';
import {
  GetModelsFilterInput,
  CreateModelInput,
  UpdateModelInput,
} from './inputs';
import { CreateFileInput, File, FileGuard, FileService } from '../file';
import {
  PrintConfig,
  PrintConfigService,
  UpdatePrintConfigInput,
} from '../print-config';

@Resolver(() => Model)
export class ModelResolver {
  constructor(
    private modelService: ModelService,
    private fileService: FileService,
    private printConfigService: PrintConfigService,
  ) {}

  @Mutation(() => Model)
  createModel(@Args('createModelInput') createModelInput: CreateModelInput) {
    return this.modelService.createModel(createModelInput);
  }

  @Mutation(() => File)
  @UseGuards(FileGuard)
  createModelFile(
    @Args('id') id: string,
    @Args('createFileInput') createFileInput: CreateFileInput,
  ): Promise<File> {
    return this.modelService.createModelFile(id, createFileInput);
  }

  @Query(() => [Model])
  models(
    @Args('filterInput') filterInput: GetModelsFilterInput,
  ): Promise<Model[]> {
    return this.modelService.getModels(filterInput);
  }

  @Query(() => Model)
  model(@Args('id') id: string): Promise<Model> {
    return this.modelService.getModelById(id);
  }

  @Mutation(() => Model)
  updateModel(
    @Args('id') id: string,
    @Args('updateModelInput') updateModelInput: UpdateModelInput,
  ): Promise<Model> {
    return this.modelService.updateModel(id, updateModelInput);
  }

  @Mutation(() => Model)
  updatePrintConfig(
    @Args('id') id: string,
    @Args('updatePrintConfigInput')
    updatePrintConfigInput: UpdatePrintConfigInput,
  ): Promise<Model> {
    return this.modelService.updateModelPrintConfig(id, updatePrintConfigInput);
  }

  @ResolveField('file', () => File)
  file(@Parent() model: Model): Promise<File> {
    return this.fileService.getFileById(model.fileId);
  }

  @ResolveField('printConfig', () => File)
  printConfig(@Parent() model: Model): Promise<PrintConfig> {
    return this.printConfigService.getPrintConfigById(model.printConfigId);
  }
}
