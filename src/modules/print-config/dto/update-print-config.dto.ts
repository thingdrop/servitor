import { PartialType } from '@nestjs/mapped-types';
import { CreatePrintConfigDto } from './create-print-config.dto';

export class UpdatePrintConfigDto extends PartialType(CreatePrintConfigDto) {}
