import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SqsService } from '../aws';
import { ModelService } from './model.service';
import { FileService, FileStatus } from '../file';
import { ModelStatus } from './types';

@Injectable()
export class ModelHandlerService {
  private logger: Logger = new Logger(ModelHandlerService.name);
  public listener;

  constructor(
    private sqsService: SqsService,
    private modelService: ModelService,
    private fileService: FileService,
  ) {}

  async listen() {
    /* Initialize queue listener */
    const { AWS_SERVITOR_QUEUE } = process.env;
    this.listener = this.sqsService.createListener(
      AWS_SERVITOR_QUEUE,
      this.handleEvent,
    );
    this.listener.start();

    if (this.listener.isRunning) {
      this.logger.log('Listening for processed model events');
    }
  }

  handleEvent = async (message): Promise<void> => {
    this.logger.log(`[EVENT: Proccessed Model]: ${JSON.stringify(message)}`);
    try {
      const body = JSON.parse(message.Body);
      const { modelId, file: fileObj } = body;

      const model = await this.modelService.getModelById(modelId);
      const file = await this.fileService.getFileById(model.fileId);

      if (!file) {
        throw new NotFoundException(
          `File with key: ${fileObj.key} was not found for model: ${model.id}. It's possible this file has already been processed.`,
        );
      }
      const { key, imagePreview, eTag, size, bucket } = fileObj;
      // Update file entity with new key, thumbail URL, etc.
      file.name = `${file.name}.glb`;
      file.key = key;
      file.imagePreview = imagePreview;
      file.eTag = eTag;
      file.size = size;
      file.bucket = bucket;
      file.status = FileStatus.COMPLETE;

      /* Check model status */
      model.status = ModelStatus.COMPLETE;

      /* Save model/file */
      await Promise.all([
        this.modelService.saveModel(model),
        this.fileService.saveFile(file),
      ]);
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  };

  createKey(folder: string, filename: string, ext: string): string {
    const name: string = filename
      .split('/')
      .slice(1)
      .join('')
      .split('.')
      .slice(0, -1)
      .join('');
    return `${folder}/${name}.${ext}`;
  }
}
