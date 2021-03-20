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
import { PrintConfig, PrintConfigService } from '../print-config';
import { Part, PartService } from '../part';

@Resolver(() => Model)
export class ModelResolver {
  constructor(
    private modelService: ModelService,
    private partService: PartService,
    private printConfigService: PrintConfigService,
  ) {}

  @Mutation(() => Model)
  createModel(@Args('createModelInput') createModelInput: CreateModelInput) {
    return this.modelService.create(createModelInput);
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

  @ResolveField('printConfig', () => PrintConfig)
  printConfig(@Parent() model: Model): Promise<PrintConfig> {
    return this.printConfigService.getById(model.printConfigId);
  }

  @ResolveField('parts', () => Part)
  parts(@Parent() model: Model): Promise<Part[]> | Part[] {
    if (model.parts) {
      return model.parts;
    }
    return this.partService.findAllByModelId(model.id);
  }
}
