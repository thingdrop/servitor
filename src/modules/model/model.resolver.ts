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
import { GetModelsFilterDto, AddFilesDto } from './dto';
import { CreateModelInput } from './inputs';
import { File, FileGuard } from '../file';

@Resolver(() => Model)
export class ModelResolver {
  constructor(private modelService: ModelService) {}

  @Mutation(() => Model)
  createModel(@Args('createModelInput') createModelInput: CreateModelInput) {
    return this.modelService.createModel2(createModelInput);
  }

  @Mutation(() => [File])
  @UseGuards(FileGuard)
  addFiles(
    @Args('id') id: string,
    @Args('addFilesDto') addFilesDto: AddFilesDto,
  ) {
    console.log({ id, addFilesDto });
    return this.modelService.addModelFiles(id, addFilesDto);
  }

  @Query(() => [Model])
  models(@Args('filterDto') filterDto: GetModelsFilterDto): Promise<Model[]> {
    return this.modelService.getModels(filterDto);
  }

  @Query(() => Model)
  model(@Args('id') id: string): Promise<Model> {
    return this.modelService.getModelById(id);
  }

  @ResolveField()
  files(@Parent() model: Model): Promise<File[]> {
    return this.modelService.getModelFiles(model.id);
  }
}
