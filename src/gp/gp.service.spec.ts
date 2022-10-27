import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatientsService } from '../patients/patients.service';
import { Repository } from 'typeorm';
import { GP } from './entities/gp.entity';
import { GpService } from './gp.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HttpException } from '@nestjs/common';

describe('GpService', () => {
  let service: GpService;
  let entity: Repository<GP>;

  const mockGp = {
    id: 1,
    surgeryName: 'Test surgery',
    address: 'test address',
    phoneNumber: '07859 746576',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GpService,
        {
          provide: PatientsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GP),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn().mockReturnValue({
              ...mockGp,
              save: jest.fn(),
            }),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GpService>(GpService);
    entity = module.get<Repository<GP>>(getRepositoryToken(GP));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      surgeryName: 'Test surgery',
      address: 'test address',
      phoneNumber: '07859 746576',
    };

    // TODO add notification check

    it('should create a new gp', async () => {
      await service.create({}, dto);

      expect(entity.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call findAll on the entity', async () => {
      await service.findAll();

      expect(entity.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const mockGp = {
      id: 1,
      surgeryName: 'Test surgery',
      address: 'test address',
      phoneNumber: '07859 746576',
    };

    it('should call findOneBy on the entity', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(true);

      await service.findOne(1);

      expect(entity.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should throw an exception if the gp does not exist', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(null);

      expect(async () => {
        await service.findOne(1);
      }).rejects.toThrow(HttpException);
    });

    it('should return gp', async () => {
      (entity.findOneBy as jest.Mock).mockReturnValueOnce(mockGp);

      const result = await service.findOne(1);

      expect(result).toEqual(mockGp);
    });
  });

  describe('update', () => {
    const updateDto = {
      surgeryName: 'new Test surgery',
      address: 'new test address',
      phoneNumber: '07859 746888',
    };

    it('should call the findOne method on the repository', async () => {
      await service.update({}, 1, updateDto);

      expect(entity.findOne).toBeCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('should update the fields to the new ones', async () => {
      const spy = jest.spyOn(entity, 'findOne');

      await service.update({}, 1, updateDto);

      expect(spy.mock.results[0].value).toStrictEqual({
        ...updateDto,
        id: 1,
        save: (await entity.findOne({})).save,
      });
    });

    // TODO test if nested save function was called

  });
});
