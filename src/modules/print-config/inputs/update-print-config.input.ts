import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePrintConfigInput } from './create-print-config.input';

@InputType()
export class UpdatePrintConfigInput extends PartialType(
  CreatePrintConfigInput,
) {}
