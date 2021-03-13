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

      const model = await this.modelService.getById(modelId);
      const files = await this.fileService.getFilesByModelId(modelId);

      const { originalKey, ...fileInput } = fileObj;

      const file = files.find((file) => file.key === originalKey);

      if (!file) {
        throw new NotFoundException(
          `File with key: ${fileObj.key} was not found for model: ${model.id}. It's possible this file has already been processed.`,
        );
      }
      // Update file entity with new key, thumbail URL, etc.
      const updateFileInput = {
        ...fileInput,
        name: this.changeExtension(file.name, 'glb'),
        status: FileStatus.COMPLETE,
      };

      /* Save model/file */
      await Promise.all([
        this.modelService.update(model.id, {
          fileId: file.id,
          status: ModelStatus.COMPLETE,
        }),
        this.fileService.update(file.id, updateFileInput),
      ]);
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  };

  changeExtension(filename: string, extension: string): string {
    if (extension.includes('.')) {
      throw new Error('changeExtension: extension cannot contain (.)');
    }
    const pos = filename.lastIndexOf('.');
    const newFilename =
      filename.substr(0, pos < 0 ? filename.length : pos) + `.${extension}`;
    return newFilename;
  }
}
