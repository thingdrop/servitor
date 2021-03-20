import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdatePrintConfigInput } from './inputs';
import { PrintConfig } from './print-config.entity';
import { PrintConfigService } from './print-config.service';

@Resolver(() => PrintConfig)
export default class PrintConfigResolver {
  constructor(private printConfigService: PrintConfigService) {}

  /* TODO: auth guard */
  @Mutation(() => PrintConfig)
  updatePrintConfig(
    @Args('id') id: string,
    @Args('updatePrintConfigInput')
    updatePrintConfigInput: UpdatePrintConfigInput,
  ): Promise<PrintConfig> {
    return this.printConfigService.update(id, updatePrintConfigInput);
  }
}
