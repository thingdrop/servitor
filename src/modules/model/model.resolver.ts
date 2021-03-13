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
import { PrintConfig, PrintConfigService } from '../print-config';
import { UseGuards } from '@nestjs/common';
import { Token } from '../../common/decorators';

@Resolver(() => Model)
export class ModelResolver {
  constructor(
    private modelService: ModelService,
    private fileService: FileService,
    private printConfigService: PrintConfigService,
  ) {}

  @Mutation(() => Model)
  createModel(@Args('createModelInput') createModelInput: CreateModelInput) {
    return this.modelService.create(createModelInput);
  }

  @Mutation(() => File)
  @UseGuards(FileGuard)
  createFile(
    @Token() token: any,
    @Args('id') id: string,
    @Args('createFileInput') createFileInput: CreateFileInput,
  ): Promise<File> {
    return this.modelService.createModelFile(token, id, createFileInput);
  }

  @Query(() => [Model])
  models(
    @Args('filterInput') filterInput: GetModelsFilterInput,
  ): Promise<Model[]> {
    return this.modelService.getModels(filterInput);
  }

  @Query(() => Model)
  model(@Args('id') id: string): Promise<Model> {
    return this.modelService.getById(id);
  }

  /* TODO: auth guard */
  @Mutation(() => Model)
  updateModel(
    @Args('id') id: string,
    @Args('updateModelInput') updateModelInput: UpdateModelInput,
  ): Promise<Model> {
    return this.modelService.update(id, updateModelInput);
  }

  @ResolveField('file', () => File)
  file(@Parent() model: Model): File | null {
    if (model.fileId) {
      return model.files.find((file) => file.id === model.fileId);
    }
    if (model.files.length === 1) {
      return model.files[0];
    }
  }

  // @ResolveField('printConfig', () => File)
  // printConfig(@Parent() model: Model): Promise<PrintConfig> {
  //   return this.printConfigService.getById(model.printConfigId);
  // }
}
