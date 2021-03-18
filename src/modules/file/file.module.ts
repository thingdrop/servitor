import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
// import { FilesController } from './files.controller';
import { File } from './file.entity';
import { FileResolver } from './file.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {}
