import { Injectable, Logger } from '@nestjs/common';
import { SqsService } from '../aws';
import { FileService } from '../file';
import { PartService } from '../part';
import { PartStatus } from '../part/types';

@Injectable()
export class PartEventService {
  private logger: Logger = new Logger(PartEventService.name);
  public listener;

  constructor(
    private sqsService: SqsService,
    private partService: PartService,
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
      this.logger.log('Listening for events');
    }
  }

  handleEvent = async (message): Promise<void> => {
    this.logger.log(`[EVENT: Proccessed Part]: ${JSON.stringify(message)}`);
    try {
      const body = JSON.parse(message.Body);
      const { file } = body;

      const { originalKey, ...fileInput } = file;

      const savedFile = await this.fileService.create(fileInput);

      const { partId } = file;
      await this.partService.update(partId, {
        status: PartStatus.COMPLETE,
        fileId: savedFile.id,
      });
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  };
}
