import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FileService, File } from '../file';
import { S3Service } from '../aws';
import { FileStatus } from './types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockId = 'e4a1e94a-4c10-4c9f-a51a-8612e7d9c06b';
const mockFile = {
  id: mockId,
  modelId: mockId,
  name: 'test',
  status: FileStatus.CREATED,
  isPrimary: true,
  size: 10000,
  key: 'key',
  bucket: 'bucket',
  eTag: '123456',
};

const mockS3Service = () => ({
  createSignedDownloadUrl: jest.fn(),
  createPresignedPost: jest.fn(),
});

describe('FileService', () => {
  let fileService: FileService;
  let fileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: getRepositoryToken(File), useClass: Repository },
        { provide: S3Service, useFactory: mockS3Service },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
    fileRepository = module.get<Repository<File>>(getRepositoryToken(File));
  });

  it('is defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('createFile', () => {
    it('calls repository create/save', async () => {
      fileRepository.create = jest.fn().mockReturnValue(mockFile);
      fileRepository.save = jest.fn().mockResolvedValue(null);

      expect(fileRepository.create).not.toHaveBeenCalled();
      expect(fileRepository.save).not.toHaveBeenCalled();

      await fileService.createFile(mockFile);
      expect(fileRepository.create).toHaveBeenCalled();
      expect(fileRepository.save).toHaveBeenCalled();
    });
  });

  describe('createFiles', () => {
    it('creates files with a status of CREATED', async () => {
      const valuesSpy = jest.fn().mockReturnThis();
      fileRepository.createQueryBuilder = jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        values: valuesSpy,
        execute: jest.fn(),
      }));
      expect(fileRepository.createQueryBuilder).not.toHaveBeenCalled();

      const createFilesDto = [mockFile];
      await fileService.createFiles(createFilesDto);
      expect(fileRepository.createQueryBuilder).toHaveBeenCalled();
      expect(valuesSpy).toHaveBeenCalledWith([
        {
          ...mockFile,
          status: FileStatus.CREATED,
        },
      ]);
    });
  });

  // describe('createFiles', () => {
  //   it('calls fileRepository createFiles', async () => {
  //     const createFilesDto = [
  //       {
  //         modelId: mockId,
  //         name: 'test-file.stl',
  //         key: '11182982-test-file.stl',
  //       },
  //     ];
  //     expect(fileRepository.createFiles).not.toHaveBeenCalled();

  //     await fileService.createFiles(createFilesDto);
  //     expect(fileRepository.createFiles).toHaveBeenCalled();
  //   });
  // });

  describe('getFilesByModelId', () => {
    it('returns files owned by a model', async () => {
      fileRepository.find = jest.fn().mockResolvedValue([mockFile]);
      expect(fileRepository.find).not.toHaveBeenCalled();

      const result = await fileService.getFilesByModelId(mockId);
      expect(fileRepository.find).toHaveBeenCalledWith({
        where: { modelId: mockId },
      });
      expect(result).toContainEqual(mockFile);
    });

    it('Returns empty array when no files are found', async () => {
      fileRepository.find = jest.fn().mockResolvedValue([]);
      const result = await fileService.getFilesByModelId(mockId);
      expect(result).toEqual([]);
    });
  });

  describe('getFileById', () => {
    it('returns a file', async () => {
      const file = { ...mockFile };
      fileRepository.findOne = jest.fn().mockResolvedValue(file);

      const result = await fileService.getFileById(file.id);
      expect(result).toEqual(file);

      expect(fileRepository.findOne).toHaveBeenCalledWith({
        where: { id: file.id },
      });
    });

    it('throws an error when no file is found', () => {
      fileRepository.findOne = jest.fn().mockResolvedValue(null);
      expect(fileService.getFileById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
