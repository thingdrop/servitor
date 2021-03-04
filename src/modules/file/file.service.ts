import {
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service, SignedUrlOptions } from '../aws';
import { File } from './file.entity';
import { ModelFileTypes, FileStatus } from './types';
import { CreateFileInput, UpdateFileInput } from './inputs';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private s3Service: S3Service,
  ) {}

  async createFile(
    model: any,
    createFileInput: CreateFileInput,
  ): Promise<File> {
    const file = this.fileRepository.create(createFileInput);

    file.model = model;
    file.status = FileStatus.CREATED;
    const key = this.createFileKey(file.name);
    file.key = key;

    await this.fileRepository.save(file);

    const contentType = this.getContentType(file.name);
    const postPolicy = this.createPresignedPostRequest({
      metadata: { modelId: model.id },
      key,
      contentType,
      expires: 60 * 60,
    });

    file.contentType = contentType;
    file.postPolicy = postPolicy;
    return file;
  }

  saveFile(file: File) {
    return this.fileRepository.save(file);
  }

  async getFileByModelId(id: string): Promise<File> {
    const file = await this.fileRepository.findOne({ where: { id: id } });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async getFileById(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async updateFile(updateFileInput: UpdateFileInput) {
    const file = await this.fileRepository.findOne({
      where: { key: updateFileInput.key },
    });
    const { size, eTag, bucket } = updateFileInput;
    file.size = size;
    file.eTag = eTag;
    file.bucket = bucket;
    await this.fileRepository.save(file);
    return file;
  }

  async downloadFile(id: string): Promise<any> {
    const file = await this.getFileById(id);
    const downloadUrl = this.s3Service.createSignedDownloadUrl({
      key: file.key,
      expires: 60 /* download links expire in 1 minute */,
    });

    return { downloadUrl, name: file.name };
  }

  createPresignedPostRequest(options: SignedUrlOptions) {
    const { expires, key, metadata, contentType } = options;
    return this.s3Service.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Fields: {
        key,
        'x-amz-storage-class': process.env.AWS_S3_STORAGE_CLASS,
        'x-amz-meta-model': metadata.modelId,
      },
      Conditions: [
        { bucket: process.env.AWS_S3_BUCKET_NAME },
        { key },
        { 'x-amz-storage-class': process.env.AWS_S3_STORAGE_CLASS },
        { 'x-amz-meta-model': metadata.modelId },
        { 'Content-Type': contentType },
        ['content-length-range', 1, 262144000],
      ],
      Expires: expires,
    });
  }

  createFileKey(filename: string) {
    const epochTime: string = Date.now().toString();
    const fileFormattedName = filename
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('-');
    return `unprocessed/${epochTime}-${fileFormattedName}`;
  }

  getContentType(filename: string) {
    const fileExt = filename.split('.').pop().toUpperCase();
    const contentType = ModelFileTypes[fileExt];
    if (!contentType) {
      throw new UnsupportedMediaTypeException();
    }
    return contentType;
  }
}
