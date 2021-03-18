import {
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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

  async create(createFileInput: CreateFileInput): Promise<File> {
    const file = this.fileRepository.create(createFileInput);
    await this.fileRepository.save(file);
    return file;
  }

  saveFile(file: File) {
    return this.fileRepository.save(file);
  }

  async findByPartId(partId: string): Promise<File> {
    const file = await this.fileRepository.findOne({ where: { partId } });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async findAllByPartId(modelId: string): Promise<File[]> {
    const files = await this.fileRepository.find({ where: { modelId } });
    if (!files.length) {
      throw new NotFoundException();
    }
    return files;
  }

  async findById(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async update(id: string, updateFileInput: UpdateFileInput) {
    const file = await this.findById(id);
    const updatedFile = Object.assign(file, updateFileInput);
    await this.fileRepository.save(updatedFile);
    return updatedFile;
  }

  async downloadFile(id: string): Promise<any> {
    const file = await this.findById(id);
    const downloadUrl = this.s3Service.createSignedDownloadUrl({
      bucket: file.bucket,
      key: file.key,
      expires: 60 /* download links expire in 1 minute */,
    });
    file.downloadUrl = downloadUrl;
    return file;
  }

  createPresignedPostRequest(options: SignedUrlOptions) {
    const { key, size, expires, metadata } = options;
    return this.s3Service.createPresignedPost({
      Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME,
      Fields: {
        key,
        'x-amz-storage-class': process.env.AWS_S3_STORAGE_CLASS,
        'x-amz-meta-model': metadata.modelId,
        'x-amz-meta-part': metadata.partId,
      },
      Conditions: [
        { key },
        { bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME },
        { 'x-amz-storage-class': process.env.AWS_S3_STORAGE_CLASS },
        { 'x-amz-meta-model': metadata.modelId },
        ['content-length-range', size, size],
      ],
      Expires: expires,
    });
  }

  /* Create a key like: 2020/04/20/<uuid>.stl */
  createFileKey(filename: string) {
    const dateObj = new Date();
    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const uuid = uuidv4();
    const extension = filename.split('.').pop().toLowerCase();
    return `${year}/${month}/${day}/${uuid}.${extension}`;
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
