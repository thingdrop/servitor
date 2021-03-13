import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileService } from './file.service';
import { File } from './file.entity';
import { Token } from '../../common/decorators';
import { FileGuard } from './guards';
import { CreateFileInput } from './inputs';

@Resolver(() => File)
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Query(() => File)
  fileDownload(@Args('id') id: string) {
    return this.fileService.downloadFile(id);
  }
}
