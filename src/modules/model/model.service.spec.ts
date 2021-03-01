import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Model } from './model.entity';
import { ModelService } from './model.service';
import { ModelStatus } from './types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '../auth';
import { FileService } from '../file';

const mockId = 'e4a1e94a-4c10-4c9f-a51a-8612e7d9c06b';
const mockModel = {
  id: mockId,
  name: 'Test Model',
  description: 'Test description',
  isPrivate: true,
};

const tokenPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const mockFileService = () => ({
  createFiles: jest.fn(),
  createFileKey: jest.fn(),
  getContentType: jest.fn(),
  getFilesByModelId: jest.fn(),
  createPresignedPostRequest: jest.fn(),
});

const mockJwtService = () => ({
  signToken: jest.fn(),
});

describe('ModelService', () => {
  let modelService: ModelService;
  let modelRepository;
  let fileService;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        { provide: getRepositoryToken(Model), useClass: Repository },
        { provide: FileService, useFactory: mockFileService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    modelService = module.get<ModelService>(ModelService);
    modelRepository = module.get<Repository<Model>>(getRepositoryToken(Model));
    fileService = module.get<FileService>(FileService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('is defined', () => {
    expect(modelService).toBeDefined();
  });

  describe('createModel', () => {
    it('creates a new model with a status of CREATED', async () => {
      modelRepository.create = jest.fn().mockReturnValue(mockModel);
      modelRepository.save = jest.fn().mockResolvedValue(null);
      jwtService.signToken = jest.fn().mockReturnValue(mockToken);
      expect(modelRepository.create).not.toHaveBeenCalled();
      expect(modelRepository.save).not.toHaveBeenCalled();
      expect(jwtService.signToken).not.toHaveBeenCalled();

      const result = await modelService.createModel(mockModel);
      expect(modelRepository.create).toHaveBeenCalledWith(mockModel);
      expect(modelRepository.save).toHaveBeenCalled();
      expect(jwtService.signToken).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockModel,
        status: ModelStatus.CREATED,
      });
      expect(result.uploadToken).toMatch(tokenPattern);
    });
  });

  describe('addModelFiles', () => {
    it('returns an array of file post policies', async () => {
      const mockFileKey = 'test-model.stl';
      const mockContentType = 'model/stl';
      const mockPostPolicy = { url: 'url', fields: {} };
      modelRepository.findOne = jest.fn().mockResolvedValue(mockModel);
      fileService.createFileKey.mockReturnValue(mockFileKey);
      fileService.getContentType.mockReturnValue(mockContentType);
      fileService.createPresignedPostRequest.mockReturnValue(mockPostPolicy);
      expect(fileService.createFiles).not.toHaveBeenCalled();

      const addFilesDto = {
        files: [
          { name: 'test model.stl', size: 1000, isPrimary: true },
          { name: 'Test Model 2.stl', size: 2000, isPrimary: false },
        ],
      };
      const result = await modelService.addModelFiles(mockId, addFilesDto);
      const { files } = result;
      const [file] = files;
      expect(fileService.createFiles).toHaveBeenCalled();

      expect(files.length).toEqual(addFilesDto.files.length);
      expect(file).toHaveProperty('name', addFilesDto.files[0].name);
      expect(file).toHaveProperty('contentType', mockContentType);
      expect(file).toHaveProperty('postPolicy', mockPostPolicy);
    });
  });

  describe('getModels', () => {
    it('calls findAndCount with correct query', async () => {
      const filterDto = {
        search: 'test',
        status: ModelStatus.COMPLETE,
        sortby: 'description',
        orderby: 'ASC',
        limit: '10',
      };
      const { sortby, orderby, limit, status } = filterDto;
      modelRepository.findAndCount = jest
        .fn()
        .mockResolvedValue([[mockModel], 1]);
      expect(modelRepository.findAndCount).not.toHaveBeenCalled();

      const result = await modelService.getModels(filterDto);
      expect(modelRepository.findAndCount).toHaveBeenCalledWith({
        order: { [sortby]: orderby },
        take: parseInt(limit, 10),
        skip: 0,
        where: {
          status,
          name: expect.anything(),
        },
      });
      expect(result).toMatchObject([mockModel]);
    });
  });

  describe('getModelFiles', () => {
    it('returns files related to the model', async () => {
      const mockFiles = [{ key: 'file-1.glb' }];
      fileService.getFilesByModelId.mockResolvedValue(mockFiles);
      expect(fileService.getFilesByModelId).not.toHaveBeenCalled();

      const result = await modelService.getModelFiles(mockId);
      expect(fileService.getFilesByModelId).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockFiles);
    });
  });

  describe('getModelById', () => {
    it('should return a model', async () => {
      const model = { ...mockModel };
      modelRepository.findOne = jest.fn().mockResolvedValue(model);

      const result = await modelService.getModelById(model.id);
      expect(result).toEqual(model);

      expect(modelRepository.findOne).toHaveBeenCalledWith({
        where: { id: model.id },
      });
    });

    it('throws an error when no model is found', () => {
      modelRepository.findOne = jest.fn().mockResolvedValue(null);
      expect(modelService.getModelById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
