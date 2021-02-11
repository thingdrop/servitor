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
    const { AWS_MODEL_PROCESS_QUEUE_URL } = process.env;
    this.listener = this.sqsService.createListener(
      AWS_MODEL_PROCESS_QUEUE_URL,
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

      const [model, files] = await Promise.all([
        this.modelService.getModelById(modelId),
        this.modelService.getModelFiles(modelId),
      ]);

      /* Update matching file with new storage metadata */
      const file = files.find((f) => f.key === fileObj.originalKey);

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

      /* If file isPrimary, set its image as the entire model's image (for thumbnail) */
      if (file.isPrimary) {
        model.imagePreview = imagePreview;
      }

      /* Check model status */
      const allFilesProcessed = files.every(
        (f) => f.status === FileStatus.COMPLETE,
      );
      model.status = allFilesProcessed
        ? ModelStatus.COMPLETE
        : ModelStatus.PROCESSING;

      /* Save model/files */
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
