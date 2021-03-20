import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PartService } from './part.service';
import { Part } from './part.entity';
import { CreatePartInput } from './dto/create-part.input';
import { UpdatePartInput } from './dto/update-part.input';
import { Token } from '../../common/decorators';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';
import { File, FileService } from '../file';

@Resolver(() => Part)
export class PartResolver {
  constructor(
    private partService: PartService,
    private fileService: FileService,
  ) {}

  @Query(() => File)
  partFile(@Args('id') id: string) {
    return this.partService.getPartFile(id);
  }

  @ResolveField('file', () => File)
  file(@Parent() part: Part): Promise<File> {
    return this.fileService.findById(part.fileId);
  }

  // @Mutation(() => Part)
  // @UseGuards(AuthGuard)
  // createPart(
  //   @Token() token: any,
  //   @Args('createPartInput') createPartInput: CreatePartInput,
  // ) {
  //   if (token.modelId !== createPartInput.modelId) {
  //     throw new NotFoundException();
  //   }
  //   return this.partService.create(createPartInput);
  // }

  // @ResolveField('file', () => File)
  // file(@Parent() part: Part): File | null {
  //   if (part.fileId) {
  //     return part.files.find((file) => file.id === part.fileId);
  //   }
  //   if (part.files.length === 1) {
  //     return part.files[0];
  //   }
  // }

  // @Query(() => [Part], { name: 'part' })
  // findAll() {
  //   return this.partService.findAll();
  // }

  // @Query(() => Part, { name: 'part' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.partService.findOne(id);
  // }

  // @Mutation(() => Part)
  // updatePart(@Args('updatePartInput') updatePartInput: UpdatePartInput) {
  //   return this.partService.update(updatePartInput.id, updatePartInput);
  // }

  // @Mutation(() => Part)
  // removePart(@Args('id', { type: () => Int }) id: number) {
  //   return this.partService.remove(id);
  // }
}
